'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react'; // Corrected the icon name to Upload
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function SettingsModule() {
  const [userDetails, setUserDetails] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: '',
    profilePicture: null,
    businessName: 'My Business',
    businessLogo: null,
  });

  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);

  // Handle user input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      if (type === 'profile') {
        setUserDetails((prev) => ({ ...prev, profilePicture: URL.createObjectURL(file) }));
      } else if (type === 'business') {
        setUserDetails((prev) => ({ ...prev, businessLogo: URL.createObjectURL(file) }));
      }
    }
  };

  // Handle password update
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserDetails((prev) => ({ ...prev, password: value }));
    setIsPasswordUpdated(true);
  };

  const handleSaveChanges = () => {
    console.log('Changes Saved!');
    // Here, implement your save logic to update the user data in your database
  };

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>
                {userDetails.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" className="text-blue-600 hover:text-blue-800">
                <Upload className="h-5 w-5 mr-2" />
                Upload Profile Picture
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={userDetails.name}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={userDetails.email}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Business Settings */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle>Business Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              name="businessName"
              value={userDetails.businessName}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="businessLogo">Business Logo</Label>
            <div className="flex items-center">
              <Avatar size="lg">
                <AvatarFallback>
                  {userDetails.businessName[0]}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                className="ml-4 text-blue-600 hover:text-blue-800"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Logo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={userDetails.password}
              onChange={handlePasswordChange}
              className="mt-1"
            />
            {isPasswordUpdated && (
              <p className="text-sm text-green-500 mt-2">Password updated successfully</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save Changes */}
      <div className="flex justify-end">
        <Button onClick={handleSaveChanges} className="bg-blue-600 text-white hover:bg-blue-700">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
