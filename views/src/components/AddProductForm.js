import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Button, Modal, Toast } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../redux/actions/fetchCategoriesAction";
import { addProduct } from "../redux/actions/addProductAction";

// form validation using yup
const validate = () =>
  Yup.object({
    name: Yup.string()
      .required("This field is required")
      .min(2, "Must be more then 2 characters"),
    description: Yup.string()
      .required("This field is required")
      .min(10, "Must be more then 10 characters"),
    category: Yup.string().required("This field is required"),
    price: Yup.number()
      .required("This field is required")
      .positive("Please enter Positive number")
      .integer("Please enter number more than 0"),
    numberInStock: Yup.number()
      .required("This field is required")
      .positive("Please enter Positive number")
      .integer("Please enter number more than 0"),
  });

// our main function component
function AddProductForm() {
  //handle modal show and hide
  const [show, setShow] = useState(false);

  // importing categories and laoding state from out store
  const { categories, loading } = useSelector((state) => state.categoriesss);

  // handle modal show and close
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // react redux method to dispatch our functions
  const dispatch = useDispatch();

  // fetch all the the categories with dispatch before our component render
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  //our form initial state
  const initialState = {
    name: "",
    description: "",
    category: "",
    price: "",
    numberInStock: "",
    productImage: "",
  };

  // handle submit our form
  const handleSubmit = (values) => {
    const newProduct = {
      name: values.name,
      description: values.description,
      category: values.category,
      price: values.price,
      numberInStock: values.numberInStock,
      productImage: values.productImage,
    };

    dispatch(addProduct(newProduct));

    handleClose();
  };

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Add Product
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialState}
            validationSchema={validate}
            onSubmit={handleSubmit}
          >
            <form
              action="/api/product/create"
              method="post"
              enctype="multipart/form-data"
            >
              <div className="form-group">
                <Field
                  className="form-control mb-2"
                  type="text"
                  placeholder="Enter Product name"
                  name="name"
                  required
                />
                <ErrorMessage name="name" component={Toast} />
              </div>
              <div className="form-group">
                <Field
                  className="form-control mb-2"
                  as="textarea"
                  placeholder="Enter Product description"
                  name="description"
                  required
                />
                <ErrorMessage name="description" component={Toast} />
              </div>
              <div className="form-group">
                <Field
                  as="select"
                  className="custom-select mb-2"
                  name="category"
                  required
                >
                  {loading && <option>loading...</option>}
                  {categories.map((cat) => {
                    return (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    );
                  })}
                </Field>
                <ErrorMessage name="category" />
              </div>
              <div className="form-group">
                <Field
                  className="form-control mb-2"
                  type="text"
                  placeholder="Enter Product price"
                  name="price"
                  required
                />
                <ErrorMessage name="price" component={Toast} />
              </div>
              <div className="form-group">
                <Field
                  className="form-control mb-2"
                  type="text"
                  placeholder="Enter Product numberInStock"
                  name="numberInStock"
                  required
                />
                <ErrorMessage name="numberInStock" component={Toast} />
              </div>
              <div className="form-group">
                <input
                  className="custom custom-file mb-2"
                  type="file"
                  name="productImage"
                  required
                />
              </div>
              <Button variant="primary" type="submit">
                Submit{" "}
              </Button>{" "}
              <Button variant="secondary" onClick={handleClose}>
                Close{" "}
              </Button>{" "}
            </form>
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AddProductForm;
