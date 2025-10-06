import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await fetch('/api/profile', {
                credentials: 'include'
            });
            console.log(response)
            if (response.ok) {
                const data = await response.json();
                setUser(data.profile);
                setFormData({
                    name: data.profile.username || '',
                    email: data.profile.email || '',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else if (response.status === 401) {
                navigate('/login');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage('Error loading profile data');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email
                })
            });

            const data = await response.json();

            if (response.ok) {
                setUser(prev => ({
                    ...prev,
                    username: formData.name,
                    email: formData.email
                }));
                setIsEditing(false);
                setMessage('Profile updated successfully!');
            } else {
                setMessage(data.error || 'Error updating profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setFormData({
            name: user?.username || '',
            email: user?.email || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setMessage('');
    };

    if (!user) {
        return (
            <div className="profile-container">
                <div className="loading">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>My Profile</h1>
                <p>Manage your account information and settings</p>
            </div>

            {message && (
                <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}

            <div className="profile-content">
                {/* Profile Information Card */}
                <div className="profile-card">
                    <div className="card-header">
                        <h3>Personal Information</h3>
                        {!isEditing && (
                            <button 
                                className="btn-edit"
                                onClick={() => setIsEditing(true)}
                            >
                                <i className="fas fa-edit"></i> Edit Profile
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSaveProfile}>
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button 
                                    type="submit" 
                                    className="btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button 
                                    type="button" 
                                    className="btn-secondary"
                                    onClick={handleCancelEdit}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="profile-info">
                            <div className="info-item">
                                <label>Full Name:</label>
                                <span>{user.username}</span>
                            </div>
                            <div className="info-item">
                                <label>Email:</label>
                                <span>{user.email}</span>
                            </div>
                            <div className="info-item">
                                <label>User Type:</label>
                                <span className="user-type-badge">{user.usertype}</span>
                            </div>
                            <div className="info-item">
                                <label>Member Since:</label>
                                <span>{new Date(user.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="info-item">
                                <label>User ID:</label>
                                <span className="user-id">#{user.id}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;

