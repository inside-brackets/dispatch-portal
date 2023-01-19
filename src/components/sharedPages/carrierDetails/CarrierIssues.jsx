import React, { useState, useEffect } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import Loader from "react-loader-spinner";
import "./carrierIssues.css"
import Accordion from '../../accordion/Accordion';
import Modal from "../../modals/MyModal";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "react-router";
import { toast } from "react-toastify";
const CarrierIssues = () => {
  const currUser = useSelector((state) => state.user.user);
  const [show, setShow] = useState()
  const [carrierId, setCarrierId] = useState();
  const [openTickets, setOpenTickets] = useState([]);
  const [closedTickets, setClosedTickets] = useState([]);
  const [validated, setValidated] = useState(false);
  const [loader, setLoader] = useState(false)
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams()
  const { getRootProps, getInputProps, acceptedFiles, isDragActive } =
    useDropzone({});
  const files = acceptedFiles.map((file) => (
    <li key={file.path}>{file.path}</li>
  ))
  useEffect(() => {

    let getCarrier = async () => {
      let { data } = await axios.post(`/getcarrier`, { mc_number: params.mc, })
      setIsLoading(true)
      if (data) {
        let id = data._id
        console.log(id)
        setCarrierId(id)
        console.log(carrierId, "carrierIdgetCarrier=====>")
        fetchResponse(id)
      }
    }
    getCarrier()
  }, [params.mc])
  let fetchResponse = async (id) => {
    setIsLoading(true)
    setError(false)
    let { data } = await axios.post('/ticket/get/all', { carrier: id })
    if(data){
      setOpenTickets(data.open.tickets)
      setClosedTickets(data.closed.tickets)
      setIsLoading(false)
    }else{
      setError(true)
    }
    console.log(data, "response=======>")
    console.log(carrierId, "carrierId=====>")

  }
  // useEffect(()=>{

  // },[])
  const submitHandler = async (e) => {
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoader(true)
      e.preventDefault();

      let arr = [];
      for (let i = 0; i < acceptedFiles.length; i++) {
        const { data: url } = await axios(
          `/s3url/ticket_documents/${currUser?.user_name
          }.${acceptedFiles[i].type.split("/")[1]}`
        );
        await axios.put(url, acceptedFiles[i]);
        arr[i] = {
          name: acceptedFiles[i].name,
          url: `${url.split("?")[0]}`
        }
      }
      try {
        let createTicket = await axios.post('/ticket/create', {
          title: e.target.title.value,
          desc: e.target.desc.value,
          carrier:carrierId, 
          // carrier: "61d2dad435744218249b66e6",
          dispatcher: currUser._id,
          files: arr
        })
        if (createTicket) {
          fetchResponse(carrierId)
          setLoader(false)
          setShow(false)
          toast.success("Ticket created successfully");
        }
      } catch (error) {
        setLoader(false)
        setShow(false)
        toast.error("Ticket creation failed");
      }
    } else {
      setValidated(true);
    }
  }
  // if (isLoading && !error) {
  //   return (
  //     <div className="spreadsheet__loader">
  //       <Loader type="MutatingDots" color="#349eff" height={100} width={100} />
  //     </div>
  //   );
  // } else if (!isLoading && error) {
  //   return (
  //     <div className="spreadsheet__loader">
  //       <h4 style={{ color: "red" }}>ERROR: SERVER MIGHT BE DOWN</h4>
  //     </div>
  //   );
  // }
  return (
    <>
      <div className="issue_wrapper">
        {currUser.department === "admin" || currUser.department === "dispatch" ? <div className="create_issue_btn"><Button onClick={() => { setShow(true) }}>Create</Button></div> : null}
        {isLoading?(
      <div className="spreadsheet__loader">
        <Loader type="MutatingDots" color="#349eff" height={100} width={100} />
      </div>
    ):(<>
        <h5>Opened Tickets({openTickets?.length})</h5>
        <div className="issue_accordion">
          {openTickets?.map((item, index) => {
            console.log(openTickets, "opentickets")
            return (
              <Accordion title={item.title} desc={item.desc} dispatcherName={item.dispatcher.user_name} createdAt={item.createdAt} files={item.files} id={item._id}  key={index} ticketNo={item.ticketNo}  status={item.status} fetchResponse={fetchResponse}  />
            )
          })
          }
        </div>
       
        <h5>Closed Tickets({closedTickets?.length})</h5>
        <div className="issue_accordion">
          {closedTickets?.map((item, index) => (
            <Accordion title={item.title} desc={item.desc} dispatcherName={item.dispatcher.user_name} createdAt={item.updatedAt} files={item.files} id={item._id} ticketNo={item.ticketNo} key={index} status={item.status} fetchResponse={fetchResponse} />
          ))
          }
        </div>
        </>
      )}

      </div>
      <Modal
        show={show}
        heading="Create Ticket"
        onClose={() => {
          setShow(false);
        }}
        size="lg"
      >
        <Form
          onSubmit={submitHandler}
          validated={validated}
        >
          <Form.Group className="mb-3 " controlId="deactivate_carrier">
            <Form.Label className="">
              Title
            </Form.Label>
            <Form.Control
              // className="subject_text"
              placeholder="Title"
              type="text"
              name="title"
              required
              minLength={10}
              maxLength={60}
            />
            <Form.Control.Feedback type="invalid">
              Title must be at least 10 characters long!
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="content">
            <Form.Label className="">
              Description
            </Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Description..."
              // className="content_text"
              type="text"
              name="desc"
              required
              minLength={30}
              maxLength={500}
              rows={8}
            />
            <Form.Control.Feedback type="invalid">
              Description must be at least 30 characters long!
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3 upload_file_group" controlId="deactivate_carrier">
            <div {...getRootProps({ className: "dropzone" })}>
              <input
                className="input-zone"
                {...getInputProps()}
                type="file"
                name="file"
              // onChange={drop}
              />
              <div className="text-center upload_drap_wrapper">


                <button type="button" className="butn">
                  UPLOAD
                </button>
                {isDragActive ? (
                  <span className="drap_text">
                    Release to drop the files here
                  </span>
                ) : (<>
                  <span className="drap_text"> OR drag and drop file here</span>
                </>
                )}


              </div>
              <aside>
                <ul>{files}</ul>
              </aside>
            </div>
          </Form.Group>
          <div className="btn_feedback">
            <Button type="submit" disabled={loader}>
              {loader ? (
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )
                : null}
              Create</Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}
export default CarrierIssues;