import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

const Salary = () => {
  const [image, setImage] = useState("");

  const uploadFileHandler = async (event) => {
    // console.log(image);

    event.preventDefault();
    // const file = image[0];

    // get secure url from our server
    const { url } = await fetch("/s3Url").then((res) => res.json());
    console.log(url);

    // post the image direclty to the s3 bucket
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: image,
    });

    const imageUrl = url.split("?")[0];
    console.log(imageUrl);

    // post requst to my server to store any extra data

    const img = document.createElement("img");
    img.src = imageUrl;
    document.body.appendChild(img);
  };

  return (
    <div>
      <Form.Group>
        <Form.Label>Image</Form.Label>
        <Form.Control
          type="text"
          name="image"
          placeholder="Enter image url"
          // required
          value={image}
          onChange={(e) => setImage(e.target.value)}
        ></Form.Control>

        <Form.File
          id="image-file"
          label="Choose Image"
          custom
          onChange={uploadFileHandler}
        ></Form.File>
      </Form.Group>
    </div>
  );
};

export default Salary;
