import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Modal, Toast } from "react-bootstrap";
import { addCategory } from "../redux/actions/addCategoryAction";
import { useDispatch } from "react-redux";

// form validation useing Yup
const validate = () =>
  Yup.object({
    name: Yup.string()
      .min(2, "Must be more then one character")
      .required("Category name is required"),
    description: Yup.string()
      .min(10, "Must be more than 10 characters")
      .required("This field is required"),
  });

function AddCategoryForm() {
  const [show, setShow] = useState(false);

  // handle modal show and hide
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // dispatch our redux action
  const dispatch = useDispatch();

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Add Category
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              name: "",
              description: "",
            }}
            validationSchema={validate}
            onSubmit={(values, { setSubmitting }) => {
              const newCategory = {
                name: values.name,
                description: values.description,
              };
              dispatch(addCategory(newCategory));
              handleClose();
              setSubmitting(false);
            }}
          >
            <Form>
              <div className="form-group">
                <label htmlFor="name">name</label>
                <Field type="text" name="name" className="form-control" />
                <ErrorMessage component={Toast} name="name" />
              </div>
              <div className="form-group">
                <label htmlFor="description">description</label>
                <Field
                  as="textarea"
                  name="description"
                  className="form-control"
                />
                <ErrorMessage component={Toast} name="description" />
              </div>
              <Button variant="primary" type="submit">
                Submit{" "}
              </Button>{" "}
              <Button variant="secondary" onClick={handleClose}>
                Close{" "}
              </Button>{" "}
            </Form>
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AddCategoryForm;
