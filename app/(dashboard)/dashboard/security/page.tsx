'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Lock, Trash2, Loader2 } from 'lucide-react';

type PasswordState = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  error?: string;
  success?: string;
};

type DeleteState = {
  password?: string;
  error?: string;
  success?: string;
};

export default function SecurityPage() {
  const [passwordState, setPasswordState] = useState<PasswordState>({});
  const [deleteState, setDeleteState] = useState<DeleteState>({});
  const [isPasswordPending, setIsPasswordPending] = useState(false);
  const [isDeletePending, setIsDeletePending] = useState(false);

  // Dummy update password handler
  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPasswordPending(true);

    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get('currentPassword')?.toString() || '';
    const newPassword = formData.get('newPassword')?.toString() || '';
    const confirmPassword = formData.get('confirmPassword')?.toString() || '';

    setTimeout(() => {
      if (newPassword !== confirmPassword) {
        setPasswordState({ error: 'New passwords do not match' });
      } else if (currentPassword.length < 8 || newPassword.length < 8) {
        setPasswordState({ error: 'Password must be at least 8 characters' });
      } else {
        setPasswordState({ success: 'Password updated successfully!' });
      }
      setIsPasswordPending(false);
    }, 1000); // simulate API delay
  };

  // Dummy delete account handler
  const handleDeleteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDeletePending(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password')?.toString() || '';

    setTimeout(() => {
      if (password.length < 8) {
        setDeleteState({ error: 'Password is incorrect or too short' });
      } else {
        setDeleteState({ success: 'Account deleted (dummy)!' });
      }
      setIsDeletePending(false);
    }, 1000); // simulate API delay
  };

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium bold text-gray-900 mb-6">
        Security Settings
      </h1>

      {/* Password Update */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handlePasswordSubmit}>
            <div>
              <Label htmlFor="current-password" className="mb-2">
                Current Password
              </Label>
              <Input
                id="current-password"
                name="currentPassword"
                type="password"
                required
                minLength={8}
              />
            </div>
            <div>
              <Label htmlFor="new-password" className="mb-2">
                New Password
              </Label>
              <Input
                id="new-password"
                name="newPassword"
                type="password"
                required
                minLength={8}
              />
            </div>
            <div>
              <Label htmlFor="confirm-password" className="mb-2">
                Confirm New Password
              </Label>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
              />
            </div>
            {passwordState.error && (
              <p className="text-red-500 text-sm">{passwordState.error}</p>
            )}
            {passwordState.success && (
              <p className="text-green-500 text-sm">{passwordState.success}</p>
            )}
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isPasswordPending}
            >
              {isPasswordPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Update Password
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Account deletion is non-reversable. Please proceed with caution.
          </p>
          <form className="space-y-4" onSubmit={handleDeleteSubmit}>
            <div>
              <Label htmlFor="delete-password" className="mb-2">
                Confirm Password
              </Label>
              <Input
                id="delete-password"
                name="password"
                type="password"
                required
                minLength={8}
              />
            </div>
            {deleteState.error && (
              <p className="text-red-500 text-sm">{deleteState.error}</p>
            )}
            {deleteState.success && (
              <p className="text-green-500 text-sm">{deleteState.success}</p>
            )}
            <Button
              type="submit"
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeletePending}
            >
              {isDeletePending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
