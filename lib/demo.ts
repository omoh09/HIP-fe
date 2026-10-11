// lib/demo.ts

export const demoUser = {
  id: 'user_123',
  name: 'Jane Doe',
  email: 'jane@example.com',
  role: 'owner'
};

export const demoTeam = {
  id: 'team_123',
  name: 'Demo Team',
  planName: 'Free',
  subscriptionStatus: 'active',
  teamMembers: [
    {
      id: 'member_1',
      role: 'owner',
      user: demoUser
    },
    {
      id: 'member_2',
      role: 'member',
      user: {
        id: 'user_456',
        name: 'John Smith',
        email: 'john@example.com'
      }
    }
  ]
};
