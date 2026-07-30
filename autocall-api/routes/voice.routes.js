const express = require('express');
const router = express.Router();
const voiceController = require('../controllers/voice.controller');
const { authenticate } = require('../middlewares/auth');
const { checkPermission } = require('../middlewares/permission');

router.use(authenticate);

router.get('/', checkPermission('view.voices'), voiceController.getAllVoices);
router.get('/sync', checkPermission('sync.voices'), voiceController.syncVoices);
router.post('/synthesize', checkPermission('synthesize.voices'), voiceController.synthesizeSpeech);

module.exports = router;