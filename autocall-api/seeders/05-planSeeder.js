exports.up = async ({ db }, mongoose) => {
  const { Plan } = db;
  try {
    const plans = [
      {
        name: 'Free Plan',
        slug: 'free-plan',
        description: 'Get started with basic Sarvam AI & Plivo voice features.',
        plan_type: 'subscription',
        billing_cycle: 'monthly',
        validity_days: 30,
        total_credits: 50,
        is_popular: false,
        status: 'active',
        amount: 0,
        currency: 'INR',
      },
      {
        name: 'Pro Plan',
        slug: 'pro-plan',
        description: 'Advanced features & Telugu voice calling for expanding teams.',
        plan_type: 'subscription',
        billing_cycle: 'monthly',
        validity_days: 30,
        total_credits: 500,
        is_popular: true,
        status: 'active',
        amount: 2999,
        currency: 'INR',
      },
      {
        name: 'Enterprise Plan',
        slug: 'enterprise-plan',
        description: 'Unlimited access for large enterprise teams.',
        plan_type: 'subscription',
        billing_cycle: 'monthly',
        validity_days: 30,
        total_credits: 2000,
        is_popular: false,
        status: 'active',
        amount: 9999,
        currency: 'INR',
      }
    ];

    for (const planData of plans) {
      const existing = await Plan.findOne({ slug: planData.slug });
      if (!existing) {
        await new Plan(planData).save();
      }
    }

    console.log('Plans seeded successfully.');
  } catch (error) {
    console.error('Error seeding Plans:', error);
  }
};

exports.down = async ({ db }, mongoose) => {
  const { Plan } = db;
  try {
    await Plan.deleteMany({});
  } catch (error) {
    console.error('Error reverting Plan seeder:', error);
  }
};
