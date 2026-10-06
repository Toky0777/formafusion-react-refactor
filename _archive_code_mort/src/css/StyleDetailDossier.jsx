     {`
        .document-list {
          background: white;
          border-radius: 8px;
        }

        .zone-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .zone-header-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .filter-controls {
          display: flex;
          gap: 12px;
          align-items: center;
          font-size: 14px;
          color: #6b7280;
        }

        .add-doc-btn {
          width: auto;
          padding: 8px 16px;
        }

        .btn-icon {
          width: 36px;
          height: 36px;
          border: none;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
        }

        .btn-icon:hover {
          background: #f3f4f6;
        }

        .filters-section {
          background: #f9fafb;
          border-radius: 6px;
          padding: 16px;
          margin-bottom: 16px;
          border: 1px solid #e5e7eb;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .filter-label {
          display: block;
          margin-bottom: 4px;
          font-size: 12px;
          font-weight: 600;
          color: #374151;
        }

        .filter-input, .filter-select {
          width: 100%;
          padding: 6px 8px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 12px;
          background: white;
        }

        .reset-container {
          display: flex;
          align-items: flex-end;
        }

        .reset-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          background: #6b7280;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }

        .reset-icon {
          width: 12px;
          height: 12px;
        }

        .documents-container {
          border-top: 1px solid #f3f4f6;
        }

        .document-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
          border-top: 1px solid #f3f4f6;
        }

        .document-item:first-child {
          border-top: none;
        }

        .document-info {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .document-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }

        .icon-pdf {
          background: #fee2e2;
          color: #dc2626;
        }

        .icon-excel {
          background: #dcfce7;
          color: #16a34a;
        }

        .file-icon {
          width: 20px;
          height: 20px;
        }

        .document-details h4 {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 4px;
        }

        .document-meta {
          font-size: 13px;
          color: #6b7280;
          display: flex;
          gap: 16px;
        }

        .document-size {
          color: #9ca3af;
          font-size: 13px;
          margin-right: 16px;
        }

        .document-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 8px;
          border: none;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn:hover {
          background: #f3f4f6;
        }

        .action-icon {
          width: 16px;
          height: 16px;
        }

        .no-documents {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
        }

        .empty-icon {
          width: 48px;
          height: 48px;
          color: #9ca3af;
          margin-bottom: 16px;
        }

        .empty-message {
          color: #6b7280;
          margin-bottom: 16px;
        }

        .add-first-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 20px;
          font-size: 14px;
          color: #6b7280;
        }

        .page-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .page-btn.active {
          background: #6366f1;
          color: white;
        }

        .page-btn:hover:not(.active):not(.disabled) {
          background: #f3f4f6;
        }

        .page-btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .preview-modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 20px;
        }

        .preview-content {
          position: relative;
          background: white;
          border-radius: 8px;
          padding: 20px;
          max-width: 90vw;
          max-height: 90vh;
          width: 100%;
        }

        .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
        }

        .preview-title {
          margin-bottom: 16px;
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .preview-iframe {
          width: 100%;
          height: 70vh;
          border: none;
          border-radius: 4px;
        }

        .preview-image-container {
          display: flex;
          justify-content: center;
        }

        .preview-image {
          max-height: 70vh;
          max-width: 100%;
          border-radius: 4px;
        }

        .preview-unavailable,
        .preview-error {
          text-align: center;
          padding: 40px 20px;
        }

        .preview-message,
        .error-message {
          margin-bottom: 20px;
          color: #6b7280;
        }

        .download-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .loading-text {
          text-align: center;
          padding: 20px;
          color: #6b7280;
        }

        .error-text {
          text-align: center;
          padding: 20px;
          color: #dc2626;
        }
      `}