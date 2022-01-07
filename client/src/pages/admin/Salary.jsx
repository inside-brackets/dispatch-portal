import React from "react";

const Salary = () => {
  return (
    <div>
      <Form.Group>
        <Form.Label>Load Weight:</Form.Label>
        <Form.Control
        // type="number"
        // placeholder="Enter here"
        // value={weight}
        // onChange={(e) => setWeight(e.target.value)}
        // required
        />
      </Form.Group>
      <Button type="submit" onSubmit={handleSubmit}>
        Add Load
      </Button>
    </div>
  );
};

export default Salary;
