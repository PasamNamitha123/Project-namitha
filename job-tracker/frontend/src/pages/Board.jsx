
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import FilterBar from "../components/forms/FilterBar";
import ApplicationForm from "../components/forms/ApplicationForm";
import useApplications from "../hooks/useApplications";
import useDebounce from "../hooks/useDebounce";

import {
  createApplication,
  updateApplication,
  deleteApplication,
} from "../api/applications";

const STATUSES = [
  "wishlist",
  "applied",
  "interview",
  "offer",
  "rejected",
];

const PAGE_SIZE = 10;

const formatStatus = (status) =>
  status.charAt(0).toUpperCase() + status.slice(1);

export default function Board() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("position");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [actionError, setActionError] = useState("");

  const debouncedSearch = useDebounce(search, 400);

  const filters = {
    search: debouncedSearch || undefined,
    status: status || undefined,
    location: location || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
    page,
    page_size: PAGE_SIZE,
  };

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = useApplications(filters);

  const applications = data?.items ?? [];

  const refreshApplications = () => {
    queryClient.invalidateQueries({ queryKey: ["applications"] });
  };

  const createMutation = useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      setShowForm(false);
      setActionError("");
      refreshApplications();
    },
    onError: (err) => {
      setActionError(
        err.response?.data?.detail || "Could not create application."
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateApplication(id, data),
    onSuccess: () => {
      setShowForm(false);
      setEditingApplication(null);
      setActionError("");
      refreshApplications();
    },
    onError: (err) => {
      setActionError(
        err.response?.data?.detail || "Could not update application."
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      setActionError("");
      refreshApplications();
    },
    onError: (err) => {
      setActionError(
        err.response?.data?.detail || "Could not delete application."
      );
    },
  });

  const saving = createMutation.isPending || updateMutation.isPending;

  const openAddForm = () => {
    setEditingApplication(null);
    setActionError("");
    setShowForm(true);
  };

  const openEditForm = (application) => {
    setEditingApplication(application);
    setActionError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingApplication(null);
  };

  const handleFormSubmit = (formData) => {
    if (editingApplication) {
      updateMutation.mutate({
        id: editingApplication.id,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (application) => {
    const confirmed = window.confirm(
      `Delete your application to ${application.company}?`
    );

    if (confirmed) {
      deleteMutation.mutate(application.id);
    }
  };

  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const groupedApplications = STATUSES.reduce((groups, currentStatus) => {
    groups[currentStatus] = applications.filter(
      (application) => application.status === currentStatus
    );
    return groups;
  }, {});

  if (isLoading) {
    return (
      <div className="board-message">
        Loading applications...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="board-message error">
        <h2>Unable to load applications</h2>
        <p>{error.message}</p>
        <p>Check that you are logged in and your backend is running.</p>
      </div>
    );
  }

  return (
    <main className="board-page">
      <header className="board-header">
        <div>
          <p className="eyebrow">CAREER MANAGEMENT</p>
          <h1>Job Application Tracker</h1>
          <p className="board-subtitle">
            Keep track of every opportunity, from wishlist to offer.
          </p>
        </div>

        <button className="btn-primary add-button" onClick={openAddForm}>
          + Add Application
        </button>
      </header>

      <section className="board-summary">
        <div>
          <span>Total applications</span>
          <strong>{data?.total ?? 0}</strong>
        </div>
        <div>
          <span>Current page</span>
          <strong>{data?.page ?? page}</strong>
        </div>
        <div>
          <span>Applications per page</span>
          <strong>{applications.length}</strong>
        </div>
      </section>

      <FilterBar
        search={search}
        setSearch={handleFilterChange(setSearch)}
        status={status}
        setStatus={handleFilterChange(setStatus)}
        location={location}
        setLocation={handleFilterChange(setLocation)}
        sortBy={sortBy}
        setSortBy={handleFilterChange(setSortBy)}
        sortOrder={sortOrder}
        setSortOrder={handleFilterChange(setSortOrder)}
      />

      {isFetching && (
        <p className="fetching-message">Updating applications...</p>
      )}

      {actionError && (
        <div className="action-error">
          {actionError}
        </div>
      )}

      <section className="kanban-board">
        {STATUSES.map((currentStatus) => {
          const items = groupedApplications[currentStatus];

          return (
            <div className="kanban-column" key={currentStatus}>
              <div className="column-header">
                <div className="column-title">
                  <span className={`status-dot ${currentStatus}`} />
                  <h2>{formatStatus(currentStatus)}</h2>
                </div>
                <span className="column-count">{items.length}</span>
              </div>

              <div className="column-content">
                {items.length === 0 ? (
                  <div className="empty-column">
                    <span>＋</span>
                    <p>No applications yet</p>
                  </div>
                ) : (
                  items.map((application) => (
                    <article
                      className="application-card"
                      key={application.id}
                    >
                      <div className="card-top">
                        <div className="company-avatar">
                          {application.company.charAt(0).toUpperCase()}
                        </div>

                        <span className={`status-label ${application.status}`}>
                          {formatStatus(application.status)}
                        </span>
                      </div>

                      <h3>{application.company}</h3>
                      <p className="card-role">{application.role}</p>

                      {application.location && (
                        <p className="card-detail">
                          <span>Location:</span> {application.location}
                        </p>
                      )}

                      {application.applied_on && (
                        <p className="card-detail">
                          <span>Applied:</span> {application.applied_on}
                        </p>
                      )}

                      {application.job_url && (
                        <a
                          className="job-link"
                          href={application.job_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View job posting ↗
                        </a>
                      )}

                      {application.notes && (
                        <p className="card-notes">{application.notes}</p>
                      )}

                      <div className="card-actions">
                        <button
                          className="edit-button"
                          onClick={() => openEditForm(application)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => handleDelete(application)}
                          disabled={deleteMutation.isPending}
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>

              <button
                className="column-add-button"
                onClick={openAddForm}
              >
                + Add application
              </button>
            </div>
          );
        })}
      </section>

      {applications.length === 0 && (
        <div className="empty-board">
          <h2>No applications found</h2>
          <p>
            Add your first job application or change your search and filters.
          </p>
          <button className="btn-primary" onClick={openAddForm}>
            Add your first application
          </button>
        </div>
      )}

      <div className="pagination">
        <button
          className="btn-secondary"
          disabled={page <= 1 || isFetching}
          onClick={() => setPage((current) => current - 1)}
        >
          ← Previous
        </button>

        <span>
          Page {data?.page ?? page} of {data?.total_pages ?? 0}
        </span>

        <button
          className="btn-secondary"
          disabled={
            page >= (data?.total_pages ?? 0) || isFetching
          }
          onClick={() => setPage((current) => current + 1)}
        >
          Next →
        </button>
      </div>

      {showForm && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeForm();
          }}
        >
          <section
            className="application-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-modal-title"
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">JOB DETAILS</p>
                <h2 id="application-modal-title">
                  {editingApplication
                    ? "Edit Application"
                    : "Add New Application"}
                </h2>
              </div>

              <button
                className="modal-close"
                onClick={closeForm}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <ApplicationForm
              key={editingApplication?.id ?? "new"}
              initialData={editingApplication}
              onSubmit={handleFormSubmit}
              onCancel={closeForm}
              saving={saving}
            />
          </section>
        </div>
      )}
    </main>
  );
}
