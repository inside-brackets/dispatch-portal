import React, { useRef, useState } from 'react'
import Input from "../UI/MyInput";
import './filehandletable.css'
import useInput from "../../hooks/use-input";
import { socket } from "../..";
import { Button } from "react-bootstrap";
import axios from "axios";
import EditButton from "../UI/EditButton";
import { useSelector } from "react-redux";



const FileHandleTable = ({ carrier }) => {


    const [buttonLoader, setButtonLoader] = useState(false);
    const { _id: currUserId, user_name } = useSelector(
        (state) => state.user.user
    );
    const noaRef = useRef();
    const w9Ref = useRef();
    const isNotEmpty = (value) => value.trim() !== "";
    const insuranceRef = useRef();
    const mcRef = useRef();
    const {
        value: insurance,
        isValid: insuranceIsValid,
        hasError: insuranceHasError,
        valueChangeHandler: insuranceChangeHandler,
        inputBlurHandler: insuranceBlurHandler,
    } = useInput(isNotEmpty);
    const {
        value: w9,
        isValid: w9IsValid,
        hasError: w9HasError,
        valueChangeHandler: w9ChangeHandler,
        inputBlurHandler: w9BlurHandler,
    } = useInput(isNotEmpty);

    const {
        value: mc,
        isValid: mcIsValid,
        hasError: mcHasError,
        valueChangeHandler: mcChangeHandler,
        inputBlurHandler: mcBlurHandler,
    } = useInput(isNotEmpty);
    const {
        value: noa,
        isValid: noaIsValid,
        hasError: noaHasError,
        valueChangeHandler: noaChangeHandler,
        inputBlurHandler: noaBlurHandler,
    } = useInput(isNotEmpty);


    let modalFormIsValid = false;
    if (mcIsValid || w9IsValid || insuranceIsValid ||noaIsValid) {
        modalFormIsValid = true;
    }
    // if (mcIsValid && w9IsValid && insuranceIsValid) {
    //     modalFormIsValid = true;
    // }

    const  closeSale = async () => {
        if (!modalFormIsValid) {
            return;
        }
        setButtonLoader(true);
        const files = {
            mc_file: mcRef.current.files[0],
            insurance_file: insuranceRef.current.files[0],
            noa_file: noaRef.current.files[0] ? noaRef.current.files[0] : "",
            w9_file: w9Ref.current.files[0],
        };

        for (const property in files) {
            // console.log(files[property].name + "  files:property.name")

            
            if (files[property]) {
                console.log(files[property])
                const { data: url } = await axios(
                    `${process.env.REACT_APP_BACKEND_URL}/s3url/carrier_documents/${carrier.mc_number}-${files[property].name}`
                );
                // console.log(data + " axiios")
                console.log(url + "url")
                axios.put(url, files[property]);
                files[property] = url.split("?")[0];
            }
        }
        const response = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${carrier.mc_number}`,
            {
                c_status: "registered",
                ...files,
            }
        );
        console.log(response);
        // setShowCloseModal(false);
        // history.push("/appointments");
        socket.emit("sale-closed", `New Sale By ${user_name}`);
    };
    const  updateFIleHandler = async () => {
        if (!modalFormIsValid) {
            return;
        }
        setButtonLoader(true);
        const files = {
            mc_file: mcRef.current.files[0],
            insurance_file: insuranceRef.current.files[0],
            noa_file: noaRef.current.files[0] ? noaRef.current.files[0] : "",
            w9_file: w9Ref.current.files[0],
        };

        for (const property in files) {


            if (files[property]) {
                console.log(files[property])

                await axios(
                    `${process.env.REACT_APP_BACKEND_URL}/s3url/carrier_documents/${carrier.mc_number}-${files[property].name}`
                );


                const { data: url } = await axios(
                    `${process.env.REACT_APP_BACKEND_URL}/s3url/carrier_documents/${carrier.mc_number}-${files[property].name}`
                );
                // console.log(data + " axiios")
                console.log(url + "url")
                axios.put(url, files[property]);
                files[property] = url.split("?")[0];
            }
        }
        const response = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/updatecarrier/${carrier.mc_number}`,
            {
                c_status: "registered",
                ...files,
            }
        );
        console.log(response);
        // setShowCloseModal(false);
        // history.push("/appointments");
        socket.emit("sale-closed", `New Sale By ${user_name}`);
    };
    console.log(mcRef + " mcref.current")
console.log(carrier.mc_file + " mc file")
    const addFile = ()=>{
        mcRef.current.click();
    }
    const addInsuranceFile = ()=>{
        insuranceRef.current.click();
    }
    const addw9File = ()=>{
        w9Ref.current.click();
    }
    const addnoaFile = ()=>{
        noaRef.current.click();
    }
    return (
        <>
            <table>
                <thead>
                    <tr>
                    <td>#</td>
                    <td>Title</td>
                    <td>Name</td>
                    <td>Actions</td>
                    </tr>
                </thead>
                <tbody>
                <tr>
                    <td>1</td>
                    <td>MC</td>
                    <td> <Input
                        type="file"
                        name="file"
                        className={mcHasError ? "invalid" : ""}
                        onChange={mcChangeHandler}
                        onBlur={mcBlurHandler}
                        value={mc}
                        id="mcid"
                        ref={mcRef}
                        style={{display:'none'}}
                    />
                    <label for="mcid">{mc?mc.lenght>10?mc:mc.substring(0,25):carrier.mc_file?carrier.mc_file.lenght>10?carrier.mc_file:carrier.mc_file.substring(0,19):"No file chosen"}</label>
                    </td>
                    <td>{!carrier.mc_file?<EditButton type="file" onClick={addFile} />: <div style={{paddingLeft:"13px"}}><EditButton type="edit" onClick={addFile}/><EditButton type="eye" style={{paddingLeft:"13px"}} onClick={() => {
                        const pdfWindow = window.open();
                        pdfWindow.location.href = `${carrier.mc_file}`;
                      }} /></div>}</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Insurance Certificate:</td>
                    <td>    <Input
                        style={{display:'none'}}
                        type="file"
                        name="file"
                        className={insuranceHasError ? "invalid" : ""}
                        value={insurance}
                        onChange={insuranceChangeHandler}
                        onBlur={insuranceBlurHandler}
                        ref={insuranceRef}
                        id="insuranceid"
                    />
                    <label for="insuranceid">{insurance?insurance.lenght>10?insurance:insurance.substring(0,25):carrier.insurance_file?carrier.insurance_file.lenght>10?carrier.insurance_file:carrier.insurance_file.substring(0,19):"No file chosen"}</label>
                    </td>
                    <td>{!carrier.insurance_file?<EditButton type="file" onClick={addInsuranceFile} />: <div><EditButton type="edit" onClick={addInsuranceFile} /><EditButton type="eye" onClick={() => {
                        const pdfWindow = window.open();
                        pdfWindow.location.href = `${carrier.insurance_file}`;
                      }} /></div>}</td>
                </tr>

                <tr>
                    <td>3</td>
                    <td>{'props.selectedPayment' === "factoring" ? (
                        <>NOA:</>
                    ) : (
                        <>Void Check</>
                    )}</td>
                    <td>  <Input style={{display:'none'}} id="noaid" type="file" value={noa}
                     className={noaHasError ? "invalid" : ""}
                     onChange={noaChangeHandler}
                     onBlur={noaBlurHandler}
                    name="file" ref={noaRef}/>
                    <label for="noaid">{noa?noa.lenght>10?noa:noa.substring(0,25):carrier.noa_file?carrier.noa_file.lenght>10?carrier.noa_file:carrier.noa_file.substring(0,19):"No file chosen"}</label>
                    </td>
                    <td>{!carrier.noa_file?<EditButton type="file" onClick={addnoaFile} />: <div><EditButton type="edit" onClick={addnoaFile} /><EditButton type="eye" onClick={() => {
                        const pdfWindow = window.open();
                        pdfWindow.location.href = `${carrier.noa_file}`;
                      }} /></div>}</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>W-9 Form:</td>
                    <td>  <Input
                        type="file"
                        name="file"
                        className={w9HasError ? "invalid" : ""}
                        onChange={w9ChangeHandler}
                        onBlur={w9BlurHandler}
                        value={w9}
                        ref={w9Ref}
                        id="w9id"
                        style={{display:'none'}}
                    />
                    <label for="w9id">{w9?w9.lenght>10?w9:w9.substring(0,25):carrier.w9_file?carrier.w9_file.lenght>10?carrier.w9_file:carrier.w9_file.substring(0,19):"No file chosen"}</label>
                    </td>
                    <td>{!carrier.w9_file?<EditButton type="file" onClick={addw9File} />: <div><EditButton type="edit" onClick={addw9File} /><EditButton type="eye" onClick={() => {
                        const pdfWindow = window.open();
                        pdfWindow.location.href = `${carrier.w9_file}`;
                      }} /></div>}</td>
                </tr>
    
                
                </tbody>

            </table>
            <div
              className="footer"
              style={{
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Button 
            //   onClick={truckModalHnadler}
              >Add Misc</Button>
            </div>
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                }}
            >
                <Button
                    onClick={closeSale}
                    disabled={!modalFormIsValid || buttonLoader}
                >
                    Submit
                </Button>
            </div>

        </>
    )
}

export default FileHandleTable 