const { db } = require('../models');
const Setting = db.Setting;

const CACHE_MS = 60 * 1000;
let cached = { value: null, at: 0 };

async function isDemoMode() {
  const now = Date.now();
  if (cached.value !== null && now - cached.at < CACHE_MS) {
    return cached.value;
  }
  try {
    const setting = await Setting.findOne({}).select('is_demo_mode').lean();
    const value = setting?.is_demo_mode === true;
    cached = { value, at: now };
    return value;
  } catch (err) {
    console.error('demo-mode middleware: failed to read setting', err);
    return false;
  }
}

const ALLOWED_PATHS = [
  '/api/webhook/stripe',
  '/api/webhook/razorpay',
  '/api/webhook/paypal',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/team-member/login',
  '/api/setting',
];

function isAllowedPath(path) {
  return ALLOWED_PATHS.some((p) => path === p || path.startsWith(p + '/') || path.startsWith(p + '?'));
}

const MUTATING_METHODS = ['POST', 'PUT', 'DELETE', 'PATCH'];

const denyMutationInDemo = async (req, res, next) => {
  if (!MUTATING_METHODS.includes(req.method)) {
    return next();
  }
  if (isAllowedPath(req.originalUrl)) {
    cached = { value: null, at: 0 }; // Clear cache when settings/allowed routes mutate
    return next();
  }

  // Check if request carries JWT token for superadmin
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const jwt = require('jsonwebtoken');
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded && decoded.id) {
        const User = db.User;
        const user = await User.findById(decoded.id).populate('roleId');
        if (user && (user.roleId?.name === 'super_admin' || user.email === process.env.ADMIN_EMAIL)) {
          return next();
        }
      }
    } catch (e) {
      // Continue to demo check if token fails
    }
  }

  const demo = await isDemoMode();
  if (!demo) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'action is denied in demo mode',
  });
};

module.exports = {
  isDemoMode,
  denyMutationInDemo
};
