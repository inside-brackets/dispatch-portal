import React, { useState, useEffect } from "react";
import { useParams} from "react-router-dom";
import TooltipCustom from "../../tooltip/TooltipCustom";
import Loader from "react-loader-spinner";
import DeleteConfirmation from "../../modals/DeleteConfirmation";
import MyModal from "../../modals/MyModal";
import axios from "axios";
import { toast } from "react-toastify";
import Badge from "../../badge/Badge";
import { useSelector } from "react-redux";
import "./carrierdetail.css";
import { Form, Row, Col, Button, Spinner} from "react-bootstrap";
const CarrierDocuments = ({setCarrierData }) => {
    const currUser = useSelector((state) => state.user.user);
    const params = useParams();
    const [carrier, setCarrier] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [onSelectedMcFile, setOnSelectedMcFile] = useState();
    const [onSelectedInsuranceFile, setOnSelectedInsuranceFile] = useState();
    const [onSelectedNoaFile, setOnSelectedNoaFile] = useState();
    const [onSelectedW9File, setOnSelectedW9File] = useState();
    const [selectedMiscFile, setSelectedMiscFile] = useState(null);
    const [nameMisc, setNameMisc] = useState(null);
    const [showMicsModal, setShowMicsModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [miscLoader, setMiscLoader] = useState(false);
    const [mcLoader, setMcLoader] = useState(false);
    const [w9Loader, setW9Loader] = useState(false);
    const [noaLoader, setNoaLoader] = useState(false);
    const [insuranceLoader, setInsuranceLoader] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        setError(false);
        // callBack()
        axios
            .post(`/getcarrier`, {
                mc_number: params.mc,
            })
            .then(({ data }) => {
                setIsLoading(false);
                if (data) {
                    setCarrier(data);
                } else {
                    setError(true);
                }
            });
    }, [params.mc]);

    if (isLoading && !error) {
        return (
            <div className="spreadsheet__loader">
                <Loader type="MutatingDots" color="#349eff" height={100} width={100} />
            </div>
        );
    } else if (!isLoading && error) {
        return (
            <div className="spreadsheet__loader">
                <h4 style={{ color: "red" }}>ERROR: SERVER MIGHT BE DOWN</h4>
            </div>
        );
    }
    const onSelectMcFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setOnSelectedMcFile(undefined);
            return;
        }
        setOnSelectedMcFile(e.target.files[0]);
    };
    const handleUploadMcFile = async (e) => {
        setMcLoader(true);
        if (carrier.mc_file) {
            await axios(
                `/s3url-delete/carrier_documents/${carrier.mc_file?.substring(
                    carrier.mc_file?.lastIndexOf("/") + 1
                )}`
            );
        }
        const { data: url } = await axios(
            `/s3url/carrier_documents/${carrier.mc_number}.${onSelectedMcFile.type.split("/")[1]
            }`
        );
        axios.put(url, onSelectedMcFile).then(() => {
            setMcLoader(false);
        });

        const updatedCarrier = await axios.put(
            `/updatecarrier/${carrier.mc_number}`,
            {
                mc_file: url.split("?")[0],
                updateFiles: true,
            }
        );
        setCarrierData(updatedCarrier.data);
        setCarrier(updatedCarrier.data);
        toast.success(carrier.mc_file ? "File Updated" : "File Uploaded");
    };
    const onSelectInsuranceFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setOnSelectedInsuranceFile(undefined);
            return;
        }
        setOnSelectedInsuranceFile(e.target.files[0]);
    };
    const handleUploadInsuranceFile = async (e) => {
        if (carrier.insurance_file) {
            await axios(
                `/s3url-delete/carrier_documents/${carrier.insurance_file?.substring(
                    carrier.insurance_file?.lastIndexOf("/") + 1
                )}`
            );
        }
        setInsuranceLoader(true);
        const { data: url } = await axios(
            `/s3url/carrier_documents/${carrier.mc_number}.${onSelectedInsuranceFile.type.split("/")[1]
            }`
        );
        axios.put(url, onSelectedInsuranceFile).then(() => {
            setInsuranceLoader(false);
        });
        const updatedCarrier = await axios.put(
            `/updatecarrier/${carrier.mc_number}`,
            {
                insurance_file: url.split("?")[0],
                updateFiles: true,
            }
        );
        setCarrierData(updatedCarrier.data);
        setCarrier(updatedCarrier.data);
        toast.success(carrier.insurance_file ? "File Updated" : "File Uploaded");
    };
    const onSelectNoaFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setOnSelectedNoaFile(undefined);
            return;
        }
        setOnSelectedNoaFile(e.target.files[0]);
    };
    const handleUploadNoaFile = async (e) => {
        if (carrier.noa_file) {
            await axios(
                `/s3url-delete/carrier_documents/${carrier.noa_file?.substring(
                    carrier.noa_file?.lastIndexOf("/") + 1
                )}`
            );
        }
        setNoaLoader(true);
        const { data: url } = await axios(
            `/s3url/carrier_documents/${carrier.mc_number}.${onSelectedNoaFile.type.split("/")[1]
            }`
        );
        axios.put(url, onSelectedNoaFile).then(() => {
            setNoaLoader(false);
        });

        const updatedCarrier = await axios.put(
            `/updatecarrier/${carrier.mc_number}`,
            {
                noa_file: url.split("?")[0],
                updateFiles: true,
            }
        );
        setCarrierData(updatedCarrier.data);
        setCarrier(updatedCarrier.data);
        toast.success(carrier.noa_file ? "File Updated" : "File Uploaded");
    };
    const onSelectW9File = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setOnSelectedW9File(undefined);
            return;
        }
        setOnSelectedW9File(e.target.files[0]);
    };
    const handleUploadW9File = async (e) => {
        if (carrier.w9_file) {
            await axios(
                `/s3url-delete/carrier_documents/${carrier.w9_file?.substring(
                    carrier.w9_file?.lastIndexOf("/") + 1
                )}`
            );
        }
        setW9Loader(true);
        const { data: url } = await axios(
            `/s3url/carrier_documents/${carrier.mc_number}.${onSelectedW9File.type.split("/")[1]
            }`
        );
        axios.put(url, onSelectedW9File).then(() => {
            setW9Loader(false);
        });

        const updatedCarrier = await axios.put(
            `/updatecarrier/${carrier.mc_number}`,
            {
                w9_file: url.split("?")[0],
                updateFiles: true,
            }
        );
        setCarrierData(updatedCarrier.data);
        setCarrier(updatedCarrier.data);
        toast.success(carrier.w9_file ? "File Updated" : "File Uploaded");
    };

    const onSelectFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedMiscFile(undefined);
            return;
        }
        setSelectedMiscFile(e.target.files[0]);
    };

    const handleSubmitMisc = async (e) => {
        setMiscLoader(true);
        const { data: url } = await axios(
            `/s3url/carrier_documents/${carrier.mc_number}.${selectedMiscFile.type.split("/")[1]
            }`
        );
        await axios.put(url, selectedMiscFile);
        const updatedCarrier = await axios.post(
            `/updatecarriermisc/${carrier.mc_number}`,
            {
                files: {
                    name: nameMisc,
                    file: url.split("?")[0],
                },
                updateFiles: true,
            }
        );
        setCarrierData(updatedCarrier.data);
        setCarrier(updatedCarrier.data);
        setMiscLoader(false);
        setShowMicsModal(false);
        setNameMisc("");

        toast.success("File Uploaded");
    };
    const submitDeleteMisc = async () => {
        const del = await axios(
            `/s3url-delete/carrier_documents/${deleteModal.file?.substring(
                deleteModal.file?.lastIndexOf("/") + 1
            )}`
        );
        if (del) {
            try {
                const updatedCarrier = await axios.put(
                    `/updatecarrier/${carrier.mc_number}`,
                    {
                        files: carrier.files.filter((item) => item._id !== deleteModal._id),
                    }
                );
                setCarrierData(updatedCarrier.data);
                setCarrier(updatedCarrier.data);
                setDeleteModal(false);
                toast.success("File Deleted");
            } catch (err) {
                setDeleteModal(false);
                toast.error("File Not Deleted");
            }
        } else {
            setDeleteModal(false);
            toast.error("File Not Deleted");
        }
    };

    return (
        <>
                    <Row style={{marginTop:"20px"}}>
                        <Col>
                            <h4>Carrier Documents:</h4>
                            {/* MC FILE START */}
                            <Row className="justify-content-start">
                                {/* <Col md={1}></Col> */}
                                <Col md={2}>
                                    <h4 className="fileHeading"> MC </h4>
                                </Col>
                                <Form.Group as={Col} md={4} className="file__input__contaier">
                                    <Form.Label className="file_input_label">
                                        {carrier.mc_file ? (
                                            <Badge type="success" content="Uploaded" />
                                        ) : (
                                            <Badge type="warning" content="Not uploaded" />
                                        )}
                                    </Form.Label>
                                    <Form.Control
                                        className="file__input"
                                        type="file"
                                        name="file"
                                        onChange={onSelectMcFile}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {!carrier.mc_file ? "Please Upload MC File." : null}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Col md={2} className="actions_wrapper">
                                    <TooltipCustom
                                        text={
                                            onSelectedMcFile && carrier.mc_file
                                                ? "update file"
                                                : carrier.mc_file
                                                    ? "select file to update"
                                                    : onSelectedMcFile
                                                        ? "upload file"
                                                        : "select file to upload"
                                        }
                                        id="mcfile"
                                    ></TooltipCustom>

                                    <div className="actions_button_wrapper">
                                        <div data-tip data-for="mcfile">
                                            <Button
                                                disabled={currUser.department === "sales" && !(carrier.c_status === "appointment") ? true : !onSelectedMcFile || mcLoader}
                                                className=""
                                                onClick={handleUploadMcFile}
                                            >
                                                {carrier.mc_file ? "Change File" : "Add File"}
                                                {/* <i className={`bx ${data.mc_file ? "bx-edit" : "bxs-file-plus"} action-button`} onClick={handleUploadMcFile}></i> */}
                                            </Button>
                                        </div>
                                        {carrier.mc_file ? (
                                            <>
                                                <TooltipCustom
                                                    text="view file"
                                                    id="mcfileview"
                                                ></TooltipCustom>
                                                <div data-tip data-for="mcfileview">
                                                    <Button disabled={mcLoader}>
                                                        <a href={carrier.mc_file}>
                                                            View
                                                            {/* <i className="bx bx-show-alt action-button" ></i> */}
                                                        </a>
                                                    </Button>
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                </Col>
                                <hr className="basic_file_hr" />
                            </Row>
                            {/* MC FILE END */}
                            {/* noa FILE START */}
                            <Row className="justify-content-start">
                                {/* <Col md={1}></Col> */}
                                <Col md={2}>
                                    <h4 className="fileHeading"> Noa </h4>
                                    {/* <hr/> */}
                                </Col>
                                <Form.Group as={Col} md={4} className="file__input__contaier">
                                    <Form.Label className="file_input_label">
                                        {carrier.noa_file ? (
                                            <Badge type="success" content="Uploaded" />
                                        ) : (
                                            <Badge type="warning" content="Not uploaded" />
                                        )}
                                    </Form.Label>
                                    <Form.Control
                                        className="file__input"
                                        type="file"
                                        name="file"
                                        onChange={onSelectNoaFile}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {!carrier.noa_file ? "Please Upload Noa File." : null}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Col md={2} className="actions_wrapper">
                                    <TooltipCustom
                                        text={
                                            onSelectedNoaFile && carrier.noa_file
                                                ? "update file"
                                                : carrier.noa_file
                                                    ? "select file to update"
                                                    : onSelectedNoaFile
                                                        ? "upload file"
                                                        : "select file to upload"
                                        }
                                        id="noafile"
                                    ></TooltipCustom>

                                    <div className="actions_button_wrapper">
                                        <div data-tip data-for="noafile">
                                            <Button
                                                disabled={currUser.department === "sales" && !(carrier.c_status === "appointment") ? true : !onSelectedNoaFile || noaLoader}
                                                className="action_button"
                                                onClick={handleUploadNoaFile}
                                            >
                                                {carrier.noa_file ? "Change File" : "Add File"}
                                            </Button>
                                        </div>
                                        {carrier.noa_file ? (
                                            <>
                                                <TooltipCustom
                                                    text="view file"
                                                    id="noafileview"
                                                ></TooltipCustom>
                                                <Button disabled={noaLoader} className="action_button">
                                                    <div data-tip data-for="noafileview">
                                                        <a href={carrier.noa_file}>View</a>
                                                    </div>
                                                </Button>{" "}
                                            </>
                                        ) : null}
                                    </div>
                                </Col>

                                <hr className="basic_file_hr" />
                            </Row>

                            {/* noa FILE END */}
                            {/* w9 FILE START */}
                            <Row className="justify-content-start">
                                {/* <Col md={1}></Col> */}
                                <Col md={2}>
                                    <h4 className="fileHeading"> W9 </h4>
                                </Col>
                                <Form.Group as={Col} md={4} className="file__input__contaier"
                                >
                                    <Form.Label className="file_input_label">
                                        {carrier.w9_file ? (
                                            <Badge type="success" content="Uploaded" />
                                        ) : (
                                            <Badge type="warning" content="Not uploaded" />
                                        )}
                                    </Form.Label>
                                    <Form.Control
                                        className="file__input"
                                        type="file"
                                        name="file"
                                        onChange={onSelectW9File}
                                    />
                                    <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                                </Form.Group>
                                <Col md={2} className="actions_wrapper">
                                    <TooltipCustom
                                        text={
                                            onSelectedW9File && carrier.w9_file
                                                ? "update file"
                                                : carrier.w9_file
                                                    ? "select file to update"
                                                    : onSelectedW9File
                                                        ? "upload file"
                                                        : "select file to upload"
                                        }
                                        id="w9file"
                                    ></TooltipCustom>

                                    <div className="actions_button_wrapper">
                                        <div data-tip data-for="w9file">
                                            <Button
                                                disabled={currUser.department === "sales" && !(carrier.c_status === "appointment") ? true : !onSelectedW9File || w9Loader}

                                                className="action_button"
                                                onClick={handleUploadW9File}
                                            >
                                                {carrier.w9_file ? "Change File" : "Add File"}
                                            </Button>
                                        </div>
                                        {carrier.w9_file ? (
                                            <>
                                                <TooltipCustom
                                                    text="view file"
                                                    id="w9fileview"
                                                ></TooltipCustom>
                                                <Button disabled={w9Loader} className="action_button">
                                                    <div data-tip data-for="w9fileview">
                                                        <a href={carrier.w9_file}>View</a>
                                                    </div>
                                                </Button>{" "}
                                            </>
                                        ) : null}
                                    </div>
                                </Col>
                                <hr className="basic_file_hr" />
                            </Row>
                            {/* w9 FILE END */}
                            {/* insurance_file FILE START */}
                            <Row className="justify-content-start">
                                {/* <Col md={1}></Col> */}
                                <Col md={2}>
                                    <h4 className="fileHeading"> Insurance </h4>
                                </Col>

                                <Form.Group as={Col} md={4} className="file__input__contaier">
                                    <Form.Label className="file_input_label">
                                        {carrier.insurance_file ? (
                                            <Badge type="success" content="Uploaded" />
                                        ) : (
                                            <Badge type="warning" content="Not uploaded" />
                                        )}
                                    </Form.Label>
                                    <Form.Control
                                        className="file__input"
                                        type="file"
                                        name="file"
                                        onChange={onSelectInsuranceFile}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {!carrier.insurance_file
                                            ? "Please Upload Insurance File."
                                            : null}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Col md={2} className="actions_wrapper">
                                    <TooltipCustom
                                        text={
                                            onSelectedInsuranceFile && carrier.insurance_file
                                                ? "update file"
                                                : carrier.insurance_file
                                                    ? "select file to update"
                                                    : onSelectedInsuranceFile
                                                        ? "upload file"
                                                        : "select file to upload"
                                        }
                                        id="insurancefile"
                                    ></TooltipCustom>

                                    <div className="actions_button_wrapper">
                                        <div data-tip data-for="insurancefile">
                                            <Button
                                                disabled={currUser.department === "sales" && !(carrier.c_status === "appointment") ? true : !onSelectedInsuranceFile || insuranceLoader}
                                                className="action_button"
                                                onClick={handleUploadInsuranceFile}
                                            >
                                                {carrier.insurance_file ? "Change File" : "Add File"}
                                            </Button>
                                        </div>
                                        {carrier.insurance_file ? (
                                            <>
                                                <TooltipCustom
                                                    text="view file"
                                                    id="insurancefileview"
                                                ></TooltipCustom>
                                                <Button
                                                    disabled={insuranceLoader}
                                                    className="action_button"
                                                >
                                                    <div data-tip data-for="insurancefileview">
                                                        <a href={carrier.insurance_file}>View</a>
                                                    </div>
                                                </Button>
                                            </>
                                        ) : null}
                                    </div>
                                </Col>
                            </Row>
                            {/* insurance_file FILE END */}
                            {/* Misc Files */}
                            <h4>Miscellaneous Documents:</h4>
                            <Row>
                                {carrier.files?.map((file) => {
                                    return (
                                        <div key={file.file} className="miscWrapper">
                                            <Row className="justify-content-start">
                                                <Col md={6}>
                                                    <h5 className="misc_file_name">
                                                        {" "}
                                                        {file.name.length > 10
                                                            ? file.name.substring(0, 11) + "..."
                                                            : file.name}{" "}
                                                    </h5>
                                                </Col>
                                                <Col md={2}>
                                                    <TooltipCustom
                                                        text="view file"
                                                        id={file.name}
                                                    ></TooltipCustom>
                                                    <TooltipCustom
                                                        text="delete file"
                                                        id={file.file}
                                                    ></TooltipCustom>
                                                    <div className="actions_button_misc_wrapper">
                                                        <div data-tip data-for={file.file}>
                                                            <Button
                                                                variant="danger"
                                                                onClick={() => setDeleteModal(file)}
                                                                disabled={currUser.department === "sales" && !(carrier.c_status === "appointment") ? true : false}
                                                            >
                                                                Delete File
                                                            </Button>
                                                        </div>
                                                        <div data-tip data-for={file.name}>
                                                            <Button>
                                                                <a href={file.file}>View</a>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <hr className="basic_file_hr" />
                                            </Row>
                                        </div>
                                    );
                                })}
                            </Row>

                            <DeleteConfirmation
                                showModal={deleteModal}
                                confirmModal={submitDeleteMisc}
                                hideModal={() => setDeleteModal(false)}
                                message={"Are you Sure want to delete File?"}
                                title="Delete Confirmation"
                            />
                            <Row className="add-misc-btn">
                                <Col md={2}>
                                    <Button
                                        onClick={() => {
                                            setShowMicsModal(true);
                                        }}
                                        disabled={currUser.department === "sales" && !(carrier.c_status === "appointment") ? true : false}
                                    >
                                        Add Misc
                                    </Button>
                                </Col>
                            </Row>
                            <Row>
                                <MyModal
                                    size="lg"
                                    show={showMicsModal}
                                    heading="Add Document"
                                    onClose={() => {
                                        setShowMicsModal(false);
                                        setMiscLoader(false);
                                    }}
                                    style={{ width: "auto" }}
                                >
                                    <Row className="justify-content-center">
                                        <Form.Group as={Col} md={10} controlId="validationCustom01">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                onChange={(e) => setNameMisc(e.target.value)}
                                                placeholder="First name"
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Row className="justify-content-center">
                                        <Form.Group
                                            as={Col}
                                            md={10}
                                            className="position-relative my-5"
                                        >
                                            <Form.Label>Attachments</Form.Label>
                                            <Form.Control
                                                type="file"
                                                required
                                                name="file"
                                                onChange={onSelectFile}
                                            />
                                            <Form.Control.Feedback
                                                type="invalid"
                                                tooltip
                                            ></Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>{" "}
                                    <Button
                                        style={{
                                            float: "right",
                                        }}
                                        disabled={miscLoader}
                                        onClick={handleSubmitMisc}
                                        type="submit"
                                    >
                                        {miscLoader && (
                                            <Spinner
                                                as="span"
                                                animation="grow"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                        )}
                                        Add
                                    </Button>
                                </MyModal>
                            </Row>
                            {/* Mise Files END*/}
                        </Col>
                    </Row>
        </>
    )
}

export default CarrierDocuments