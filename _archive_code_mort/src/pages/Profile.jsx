import React, { useState } from 'react';
import { User, Mail, Calendar, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Alert from '../components/UI/Alert';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        setMessage(null);

        try {
            // Simulate API call - replace with actual update logic
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update user data
            const updatedUser = { ...user, ...editData };
            setUser(updatedUser);

            setIsEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setEditData({
            name: user?.name || '',
            email: user?.email || '',
        });
        setIsEditing(false);
        setMessage(null);
    };

    if (!user) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Loading user information...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">User Profile</h1>
                <p className="text-gray-600">Manage your account information</p>
            </div>

            {message && (
                <Alert
                    type={message.type}
                    message={message.text}
                    onClose={() => setMessage(null)}
                />
            )}

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                                <User className="w-10 h-10 text-gray-600" />
                            </div>
                            <div className="text-white">
                                <h2 className="text-2xl font-bold">{user.name}</h2>
                                <p className="text-blue-100">{user.email}</p>
                            </div>
                        </div>

                        {!isEditing && (
                            <Button
                                variant="secondary"
                                onClick={() => setIsEditing(true)}
                                className="bg-white text-blue-600 hover:bg-gray-50"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </div>

                {/* Profile Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isEditing ? (
                            <>
                                <div className="space-y-4">
                                    <Input
                                        id="name"
                                        name="name"
                                        label="Full Name"
                                        value={editData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                    />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        label="Email Address"
                                        value={editData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div className="flex items-end space-x-3">
                                    <Button
                                        onClick={handleSave}
                                        isLoading={isLoading}
                                        className="flex-1"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={handleCancel}
                                        disabled={isLoading}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                        <User className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Full Name</p>
                                            <p className="text-lg text-gray-900">{user.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                        <Mail className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Email Address</p>
                                            <p className="text-lg text-gray-900">{user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                        <Calendar className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Member Since</p>
                                            <p className="text-lg text-gray-900">
                                                {formatDate(user.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    {user.updated_at && (
                                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                            <Calendar className="w-5 h-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                                                <p className="text-lg text-gray-900">
                                                    {formatDate(user.updated_at)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Additional Info Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="font-medium text-gray-500">Account Status:</span>
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                        </span>
                    </div>
                    <div>
                        <span className="font-medium text-gray-500">User ID:</span>
                        <span className="ml-2 text-gray-900 font-mono">{user.id}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;