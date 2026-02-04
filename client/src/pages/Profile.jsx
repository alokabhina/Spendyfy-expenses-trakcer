import React, { useState, useEffect } from 'react';
import { UserProfile, useUser } from '@clerk/clerk-react';
import expenseService from '../services/expenseService';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { exportToCSV, exportStatsToCSV } from '../utils/exportCSV';
import { exportDetailedPDF } from '../utils/exportPDF';

const Profile = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await expenseService.getUserProfile();
      setUserProfile(response || {});
setMonthlyBudget(response?.monthlyBudget || 0);

    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBudget = async () => {
    try {
      setSaving(true);
      await expenseService.updateUserProfile({
        monthlyBudget: parseFloat(monthlyBudget) || 0,
      });
      alert('Budget saved successfully!');
      fetchUserProfile();
    } catch (err) {
      alert('Error saving budget: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleExportAll = async () => {
    try {
      const [expensesRes, statsRes] = await Promise.all([
        expenseService.getExpenses({ limit: 1000 }),
        expenseService.getDashboardStats(),
      ]);

      const expenses = expensesRes.data;
      const stats = statsRes.data;

      exportDetailedPDF(
        { expenses, stats },
        `expense-report-full-${new Date().toISOString().split('T')[0]}.pdf`
      );
    } catch (err) {
      alert('Error exporting data: ' + err.message);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This will delete all your expenses and cannot be undone.'
    );

    if (!confirmed) return;

    const doubleConfirm = window.prompt(
      'Type "DELETE" to confirm account deletion:'
    );

    if (doubleConfirm !== 'DELETE') {
      alert('Account deletion cancelled');
      return;
    }

    try {
      await expenseService.deleteAllExpenses();
      await expenseService.deleteUserAccount();
      alert('Account deleted successfully. You will be logged out.');
      window.location.href = '/sign-in';
    } catch (err) {
      alert('Error deleting account: ' + err.message);
    }
  };

  if (loading) return <Loader message="Loading profile..." />;

  return (
    <div className="container" style={{ padding: 'var(--spacing-xl) 0' }}>
      <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Profile Settings</h1>

      <div className="grid grid-cols-1" style={{ gap: 'var(--spacing-xl)' }}>
        {/* Clerk User Profile */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Account Information</h2>
          </div>
          <UserProfile />
        </div>

        {/* Budget Settings */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Budget Settings</h2>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Monthly Budget (₹)</label>
              <input
                type="number"
                className="form-input"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                placeholder="Enter your monthly budget"
                min="0"
                step="100"
              />
              <p className="text-sm text-muted" style={{ marginTop: 'var(--spacing-sm)' }}>
                Set a monthly budget to track your spending limits
              </p>
            </div>
            <Button onClick={handleSaveBudget} disabled={saving}>
              {saving ? 'Saving...' : 'Save Budget'}
            </Button>
          </div>
        </div>

        {/* Data Export */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Data Export</h2>
          </div>
          <div className="card-body">
            <p className="text-secondary" style={{ marginBottom: 'var(--spacing-lg)' }}>
              Download all your expense data and reports
            </p>
            <Button onClick={handleExportAll} variant="secondary">
              📥 Export Complete Report (PDF)
            </Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card" style={{ borderColor: 'var(--danger-color)' }}>
          <div className="card-header" style={{ borderColor: 'var(--danger-color)' }}>
            <h2 className="card-title" style={{ color: 'var(--danger-color)' }}>
              ⚠️ Danger Zone
            </h2>
          </div>
          <div className="card-body">
            <p className="text-secondary" style={{ marginBottom: 'var(--spacing-lg)' }}>
              Once you delete your account, there is no going back. All your expense data will be permanently deleted.
            </p>
            <Button variant="danger" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;