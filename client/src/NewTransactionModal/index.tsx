import * as React from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import DatePicker from '../react-16-bootstrap-date-picker/src';
import { Transaction } from '../model/Transaction';

const categories = [
  'Income',
  'Emergency Fund',
  'Housing',
  'Savings',
  'Utilities',
  'Health Care',
  'Consumer Debt',
  'Food and Groceries',
  'Personal Care',
  'Entertainment',
  'Education',
  'Auto & Transport',
];

export const NewTransactionModal = ({ open, handleClose, addTransaction }) => {
  const [selectedCategory, setSelectedCategory] = React.useState();
  const [description, setDescription] = React.useState('');
  const [amount, setAmount] = React.useState('0.00');
  const [date, setDate] = React.useState(new Date());
  const [dateValue, setDateValue] = React.useState(new Date().toISOString());
  const [validated, setValidated] = React.useState(false);
  const createTransaction = (): Transaction => ({
    category: selectedCategory,
    description,
    amount: parseFloat(amount),
    date,
  });

  const handleSubmit = (e: React.FormEvent<any>): void => {
    const form = e.currentTarget;
    if (form.checkValidity() === false || !selectedCategory) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();
      addTransaction(createTransaction());
    }
    setValidated(true);
  };

  const handleDateChange = (date: string): void => {
    setDate(new Date(date));
    setDateValue(date);
  };

  return (
    <Modal show={open} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Transaction</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          <div style={{ marginBottom: '10px' }}>
            <strong>Category</strong>
          </div>
          <DropdownButton
            required
            variant={
              validated && !selectedCategory ? 'outline-danger' : 'light'
            }
            id="category-dropdown"
            title={selectedCategory || 'Please select a category...'}
          >
            {categories.map((category: string) => (
              <Dropdown.Item
                key={category}
                eventKey={category}
                onSelect={(value: string) => setSelectedCategory(value)}
              >
                {category}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          <Form.Control.Feedback type="invalid">
            Please select a category.
          </Form.Control.Feedback>
          <div style={{ marginBottom: '10px' }}>
            <strong>Description</strong>
          </div>
          <Form.Control
            type="text"
            placeholder="Description"
            name="description"
            value={description}
            onChange={(e: React.FormEvent<any>): void =>
              setDescription(e.currentTarget.value)
            }
            required
          />
          <Form.Control.Feedback type="invalid">
            Please enter a description.
          </Form.Control.Feedback>
          <div style={{ marginBottom: '10px' }}>
            <strong>Amount</strong>
          </div>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>$</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              type="text"
              pattern="^-?([0-9]+)(\.?[0-9]{0,2})?$"
              required
              value={amount.toString()}
              onChange={(e: React.FormEvent<any>): void =>
                setAmount(e.currentTarget.value)
              }
            />
          </InputGroup>
          <Form.Control.Feedback type="invalid">
            Please enter in a valid amount
          </Form.Control.Feedback>
          <div style={{ marginBottom: '10px' }}>
            <strong>Date</strong>
          </div>
          <DatePicker required value={dateValue} onChange={handleDateChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Add
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
