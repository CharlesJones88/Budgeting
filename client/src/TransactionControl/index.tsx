import * as React from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

let fileUploadRef: HTMLElement | undefined;

export const TransactionControl = ({
  handleOpen,
  deleteTransactions,
  uploadFile,
}) => (
  <div style={{ margin: '15px' }}>
    <Button
      style={{ marginRight: '15px' }}
      variant="primary"
      onClick={handleOpen}
    >
      + Add Transaction
    </Button>
    <Button
      style={{ marginRight: '15px' }}
      variant="danger"
      onClick={deleteTransactions}
    >
      Delete transactions
    </Button>
    <Button
      variant="secondary"
      onClick={() => fileUploadRef && fileUploadRef.click()}
    >
      Upload Transaction File
    </Button>
    <Form.Control
      ref={(fileUpload: any): void => (fileUploadRef = fileUpload)}
      onChange={uploadFile}
      type="file"
      hidden
    />
  </div>
);
