'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, PlusCircle } from 'lucide-react';
import { Suspense, useState, useEffect } from 'react';

// --- Demo data ---
const demoUser = { id: 'u1', name: 'John Doe', email: 'john@example.com', role: 'owner' };

const demoTeam = {
  planName: 'Pro',
  subscriptionStatus: 'active',
  teamMembers: [
    { id: 'm1', user: demoUser, role: 'owner' },
    { id: 'm2', user: { id: 'u2', name: 'Jane Smith', email: 'jane@example.com' }, role: 'member' },
    { id: 'm3', user: { id: 'u3', name: 'Bob Lee', email: 'bob@example.com' }, role: 'member' }
  ]
};

// --- Skeletons ---
function SubscriptionSkeleton() {
  return (
    <Card className="mb-8 h-[140px]">
      <CardHeader>
        <CardTitle>Team Subscription</CardTitle>
      </CardHeader>
    </Card>
  );
}

function TeamMembersSkeleton() {
  return (
    <Card className="mb-8 h-[140px]">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
    </Card>
  );
}

function InviteTeamMemberSkeleton() {
  return (
    <Card className="h-[260px]">
      <CardHeader>
        <CardTitle>Invite Team Member</CardTitle>
      </CardHeader>
    </Card>
  );
}

// --- Components ---
function ManageSubscription() {
  const [teamData, setTeamData] = useState<typeof demoTeam | null>(null);

  useEffect(() => {
    setTimeout(() => setTeamData(demoTeam), 100); // simulate async load
  }, []);

  if (!teamData) return <SubscriptionSkeleton />;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Team Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="mb-4 sm:mb-0">
            <p className="font-medium">Current Plan: {teamData.planName}</p>
            <p className="text-sm text-muted-foreground">
              {teamData.subscriptionStatus === 'active'
                ? 'Billed monthly'
                : teamData.subscriptionStatus === 'trialing'
                ? 'Trial period'
                : 'No active subscription'}
            </p>
          </div>
          <Button variant="outline">Manage Subscription</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamMembers() {
  const [teamData, setTeamData] = useState<typeof demoTeam | null>(null);
  const [removeState, removeAction, isRemovePending] = useActionState<{ error?: string }, FormData>(
    (formData) => {
      // Demo remove action: simulate success
      return new Promise((resolve) => setTimeout(resolve, 500));
    },
    {}
  );

  useEffect(() => {
    setTimeout(() => setTeamData(demoTeam), 100);
  }, []);

  const getUserDisplayName = (user: { name?: string; email?: string }) =>
    user.name || user.email || 'Unknown User';

  if (!teamData) return <TeamMembersSkeleton />;

  if (!teamData.teamMembers.length) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No team members yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {teamData.teamMembers.map((member, index) => (
            <li key={member.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>
                    {getUserDisplayName(member.user)
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{getUserDisplayName(member.user)}</p>
                  <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
                </div>
              </div>
              {index > 1 ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    removeAction(new FormData());
                  }}
                  disabled={isRemovePending}
                >
                  {isRemovePending ? 'Removing...' : 'Remove'}
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
        {removeState?.error && <p className="text-red-500 mt-4">{removeState.error}</p>}
      </CardContent>
    </Card>
  );
}

function InviteTeamMember() {
  const [inviteState, inviteAction, isInvitePending] = useActionState<{ error?: string; success?: string }, FormData>(
    (formData) => {
      // Demo invite action
      return new Promise((resolve) => {
        setTimeout(() => resolve(undefined), 500);
      });
    },
    {}
  );

  const isOwner = demoUser.role === 'owner';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Team Member</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <Label htmlFor="email" className="mb-2">
              Email
            </Label>
            <Input id="email" name="email" type="email" placeholder="Enter email" required disabled={!isOwner} />
          </div>
          <div>
            <Label>Role</Label>
            <RadioGroup defaultValue="member" name="role" className="flex space-x-4" disabled={!isOwner}>
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="member" id="member" />
                <Label htmlFor="member">Member</Label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="owner" id="owner" />
                <Label htmlFor="owner">Owner</Label>
              </div>
            </RadioGroup>
          </div>
          {inviteState?.error && <p className="text-red-500">{inviteState.error}</p>}
          {inviteState?.success && <p className="text-green-500">{inviteState.success}</p>}
          <Button
            type="button"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isInvitePending || !isOwner}
            onClick={() => inviteAction(new FormData())}
          >
            {isInvitePending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inviting...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Invite Member
              </>
            )}
          </Button>
        </form>
      </CardContent>
      {!isOwner && (
        <CardFooter>
          <p className="text-sm text-muted-foreground">You must be a team owner to invite new members.</p>
        </CardFooter>
      )}
    </Card>
  );
}

export default function SettingsPage() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium mb-6">Team Settings</h1>
      <Suspense fallback={<SubscriptionSkeleton />}>
        <ManageSubscription />
      </Suspense>
      <Suspense fallback={<TeamMembersSkeleton />}>
        <TeamMembers />
      </Suspense>
      <Suspense fallback={<InviteTeamMemberSkeleton />}>
        <InviteTeamMember />
      </Suspense>
    </section>
  );
}
