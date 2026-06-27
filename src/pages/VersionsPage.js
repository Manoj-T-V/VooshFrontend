import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API_URL;

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(140deg, #eef5ff 0%, #fff5fa 100%)',
    padding: '18px 16px 30px',
    boxSizing: 'border-box',
  },
  shell: {
    width: 'min(1100px, 100%)',
    margin: '0 auto',
    borderRadius: '18px',
    border: '1px solid #d8e8ff',
    background: 'linear-gradient(150deg, #ffffff 0%, #f8fbff 100%)',
    boxShadow: '0 14px 34px rgba(37, 99, 235, 0.14)',
    padding: '16px',
    boxSizing: 'border-box',
  },
  heading: {
    margin: 0,
    color: '#1e3a8a',
    fontSize: '1.5em',
    letterSpacing: '0.3px',
  },
  subHeading: {
    margin: '8px 0 0 0',
    color: '#475569',
    fontSize: '0.95em',
  },
  operationBar: {
    marginTop: '14px',
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  operationPill: {
    borderRadius: '999px',
    border: '1px solid #c7dcff',
    background: '#eff6ff',
    color: '#1d4ed8',
    padding: '6px 10px',
    fontWeight: 700,
    fontSize: '0.82em',
  },
  unsupportedPill: {
    borderRadius: '999px',
    border: '1px solid #f5d0fe',
    background: '#fdf4ff',
    color: '#a21caf',
    padding: '6px 10px',
    fontWeight: 700,
    fontSize: '0.82em',
  },
  grid: {
    marginTop: '16px',
    display: 'grid',
    gridTemplateColumns: 'minmax(280px, 360px) 1fr',
    gap: '12px',
  },
  card: {
    borderRadius: '13px',
    border: '1px solid #dbeafe',
    background: '#fff',
    padding: '12px',
    boxSizing: 'border-box',
  },
  cardTitle: {
    margin: '0 0 10px 0',
    color: '#1f2937',
    fontSize: '1.02em',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    background: '#fff',
    padding: '10px 11px',
    marginBottom: '9px',
    fontSize: '0.95em',
  },
  textarea: {
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    background: '#fff',
    padding: '10px 11px',
    minHeight: '98px',
    resize: 'vertical',
    marginBottom: '9px',
    fontSize: '0.95em',
  },
  primaryButton: {
    border: 'none',
    borderRadius: '8px',
    background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    padding: '10px 12px',
  },
  secondaryButton: {
    border: '1px solid #bfdbfe',
    borderRadius: '8px',
    background: '#eff6ff',
    color: '#1d4ed8',
    fontWeight: 700,
    cursor: 'pointer',
    padding: '9px 11px',
  },
  dangerButton: {
    border: 'none',
    borderRadius: '8px',
    background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    padding: '9px 11px',
  },
  list: {
    display: 'grid',
    gap: '9px',
  },
  item: {
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    background: '#fff',
    padding: '10px 11px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
  },
  itemMeta: {
    margin: 0,
    color: '#0f172a',
    fontWeight: 700,
    fontSize: '0.92em',
  },
  itemSub: {
    margin: '4px 0 0 0',
    color: '#64748b',
    fontSize: '0.82em',
  },
  itemActions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  infoBox: {
    borderRadius: '10px',
    border: '1px solid #dbeafe',
    background: '#f8fbff',
    color: '#334155',
    padding: '10px 11px',
    marginBottom: '10px',
  },
  errorBox: {
    borderRadius: '10px',
    border: '1px solid #fecaca',
    background: '#fff1f2',
    color: '#9f1239',
    padding: '10px 11px',
    marginTop: '10px',
  },
  successBox: {
    borderRadius: '10px',
    border: '1px solid #bbf7d0',
    background: '#f0fdf4',
    color: '#166534',
    padding: '10px 11px',
    marginTop: '10px',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.46)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1200,
    padding: '14px',
    boxSizing: 'border-box',
  },
  modalCard: {
    width: 'min(760px, 100%)',
    maxHeight: '85vh',
    overflowY: 'auto',
    borderRadius: '14px',
    border: '1px solid #dbeafe',
    background: '#fff',
    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.26)',
    padding: '14px',
    boxSizing: 'border-box',
  },
  snapshots: {
    display: 'grid',
    gap: '8px',
    marginTop: '10px',
  },
  snapshot: {
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    background: '#fff',
    padding: '10px 11px',
  },
  snapshotTitle: {
    margin: 0,
    color: '#111827',
    fontWeight: 700,
    fontSize: '0.93em',
  },
  snapshotMeta: {
    margin: '5px 0 0 0',
    color: '#475569',
    fontSize: '0.85em',
  },
};

function VersionsPage() {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [versionName, setVersionName] = useState('');
  const [note, setNote] = useState('');
  const [createPending, setCreatePending] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailVersion, setDetailVersion] = useState(null);
  const [switchPendingId, setSwitchPendingId] = useState('');

  const navigate = useNavigate();

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  const getErrorMessage = (err, fallbackText) => {
    const message =
      err?.response?.data?.msg ||
      err?.response?.data?.error?.message ||
      err?.response?.data?.error ||
      fallbackText;

    return typeof message === 'string' ? message : fallbackText;
  };

  const loadVersions = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${apiUrl}/api/tasks/versions`, getAuthConfig());
      setVersions(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      setError(getErrorMessage(err, 'Unable to load versions right now.'));
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadVersions();
  }, [loadVersions]);

  useEffect(() => {
    if (!success) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setSuccess(''), 3500);
    return () => window.clearTimeout(timeout);
  }, [success]);

  const handleCreateVersion = async (event) => {
    event.preventDefault();

    const trimmedName = versionName.trim();
    if (!trimmedName) {
      setError('Version name is required.');
      return;
    }

    setCreatePending(true);
    setError('');

    try {
      const response = await axios.post(
        `${apiUrl}/api/tasks/versions`,
        {
          versionName: trimmedName,
          note: note.trim(),
        },
        getAuthConfig()
      );

      setVersionName('');
      setNote('');
      setSuccess(response.data?.msg || 'Task version created');
      await loadVersions();
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      setError(getErrorMessage(err, 'Unable to create version.'));
    } finally {
      setCreatePending(false);
    }
  };

  const handleViewVersion = async (versionId) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setError('');

    try {
      const response = await axios.get(`${apiUrl}/api/tasks/versions/${versionId}`, getAuthConfig());
      const payload = response.data?.version || response.data;
      setDetailVersion(payload);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      setDetailOpen(false);
      setError(getErrorMessage(err, 'Unable to load version details.'));
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSwitchVersion = async (versionId) => {
    const approved = window.confirm('This will replace all current tasks with selected snapshot.');
    if (!approved) {
      return;
    }

    setSwitchPendingId(versionId);
    setError('');

    try {
      const response = await axios.post(`${apiUrl}/api/tasks/versions/${versionId}/switch`, {}, getAuthConfig());
      setSuccess(response.data?.msg || 'Switched to selected task version');
      await loadVersions();
      if (detailVersion?._id === versionId) {
        await handleViewVersion(versionId);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      setError(getErrorMessage(err, 'Unable to switch version.'));
    } finally {
      setSwitchPendingId('');
    }
  };

  const sortedVersions = [...versions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <h1 style={styles.heading}>Versions</h1>

        <div style={styles.grid}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Create</h2>
            <form onSubmit={handleCreateVersion}>
              <input
                type="text"
                value={versionName}
                onChange={(event) => setVersionName(event.target.value)}
                placeholder="Version name"
                style={styles.input}
                required
              />
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Note"
                style={styles.textarea}
              />
              <button
                type="submit"
                style={styles.primaryButton}
                disabled={createPending || !versionName.trim()}
              >
                {createPending ? 'Creating...' : 'Create'}
              </button>
            </form>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>List</h2>

            {loading ? (
              <div>Loading versions...</div>
            ) : sortedVersions.length === 0 ? (
              <div>No versions found.</div>
            ) : (
              <div style={styles.list}>
                {sortedVersions.map((version) => (
                  <div key={version._id} style={styles.item}>
                    <div>
                      <p style={styles.itemMeta}>{`${version.versionCode} - ${version.versionName}`}</p>
                      <p style={styles.itemSub}>
                        {`${version.taskCount || 0} tasks • ${new Date(version.createdAt).toLocaleString()}`}
                      </p>
                    </div>
                    <div style={styles.itemActions}>
                      <button
                        type="button"
                        style={styles.secondaryButton}
                        onClick={() => handleViewVersion(version._id)}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        style={styles.dangerButton}
                        onClick={() => handleSwitchVersion(version._id)}
                        disabled={Boolean(switchPendingId)}
                      >
                        {switchPendingId === version._id ? 'Switching...' : 'Switch'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div style={styles.errorBox} role="alert" aria-live="polite">
            {error}
          </div>
        )}

        {success && (
          <div style={styles.successBox} role="status" aria-live="polite">
            {success}
          </div>
        )}
      </div>

      {detailOpen && (
        <div style={styles.modalOverlay} onClick={() => setDetailOpen(false)}>
          <div style={styles.modalCard} onClick={(event) => event.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#1f2937' }}>Version Detail</h3>
              <button type="button" style={styles.secondaryButton} onClick={() => setDetailOpen(false)}>
                Close
              </button>
            </div>

            {detailLoading && <div style={{ marginTop: '10px' }}>Loading...</div>}

            {!detailLoading && detailVersion && (
              <>
                <div style={styles.infoBox}>
                  <strong>{`${detailVersion.versionCode} - ${detailVersion.versionName}`}</strong>
                  <div style={{ marginTop: '6px' }}>{detailVersion.note || '-'}</div>
                </div>

                <button
                  type="button"
                  style={styles.dangerButton}
                  onClick={() => handleSwitchVersion(detailVersion._id || detailVersion.id)}
                  disabled={Boolean(switchPendingId)}
                >
                  {switchPendingId === (detailVersion._id || detailVersion.id)
                    ? 'Switching...'
                    : 'Switch'}
                </button>

                <div style={styles.snapshots}>
                  {(detailVersion.tasks || []).length === 0 ? (
                    <div style={styles.infoBox}>No tasks.</div>
                  ) : (
                    detailVersion.tasks.map((snapshot, index) => (
                      <div
                        key={`${snapshot.sourceTaskId || 'snapshot'}-${index}`}
                        style={styles.snapshot}
                      >
                        <p style={styles.snapshotTitle}>{snapshot.title}</p>
                        <p style={styles.snapshotMeta}>{snapshot.status}</p>
                        <p style={styles.snapshotMeta}>{snapshot.description || '-'}</p>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VersionsPage;
