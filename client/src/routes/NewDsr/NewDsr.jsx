import React, { useState, useEffect } from "react";
import Helmet from "react-helmet";
import AnimatedComponent from "../../AnimatedComponent";
import Modal from "../../components/Modal/Modal";
// import sabash from "../../assets/images/sabash.jpeg";
// import kkr from "../../assets/images/meme.jpg";
/*
  Written the Code of NewDSR and made it responsive --- Ayush
*/
let userId = "64478175f08be675340458ec";
function NewDsr() {
	// Checking today's status of dsr(if already dsr is added the we will show edit option and remove form and leave button | if leave status is returned then it will show that you are on leave and if neither it returns leave nor dsr filled then will will show the form as well as Leave button) --Adarsh-25-apr-2023
	// const [isLeave, setIsLeave] = useState("");

	const fetchStatus = async () => {
		try {
			const response = await fetch(
				"https://new-web-app.onrender.com/todaystatus",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ user: userId }),
				}
			);
			const data = await response.json();
			// setIsLeave(data);
			return data;
		} catch (error) {
			console.error("Error:", error);
		}
	};

	useEffect(() => {
		fetchStatus();
	}, []);

	// Posting New DSR Data --Adarsh-20-April-2023
	// Creating state to get data from the inputs onChange --Adarsh-20-April-2023

	// Generating current date in readable format
	const dateTime = new Date();

	let monthArray = [
		"Jan",
		"Feb",
		"March",
		"April",
		"May",
		"June",
		"July",
		"Aug",
		"Sept",
		"Oct",
		"Nov",
		"Dec",
	];

	let currentDate =
		dateTime.getDate() +
		" " +
		monthArray[dateTime.getMonth()] +
		" " +
		dateTime.getFullYear();

	const [dsrData, setDsrData] = useState({
		date: "2023-04-20T08:33:15.958Z",
		projectName: "",
		clientManager: "",
		activitiesCompleted: "",
		activitiesPlanned: "",
		hoursWorked: "",
		status: "",
		comment: "",
		openIssues: "",
		isOnLeave: false,
		createdAt: "2023-04-20T08:33:15.958Z",
		updatedAt: "2023-04-20T08:33:15.958Z",
		user: userId,
	});

	// Setting data from input in the state for both the DSR data and Draft data --20-April-2023--Adarsh

	function storeData(e) {
		const value = e.target.value;

		setDsrData({
			...dsrData,
			[e.target.name]: value,
			date: dateTime,
			createdAt: dateTime,
			updatedAt: dateTime,
		});

		setDraftData({
			...draftData,
			[e.target.name]: value,
			date: dateTime,
			createdAt: dateTime,
			updatedAt: dateTime,
		});

		setErrors({
			...errors,
			[e.target.name]: "",
		});
	}

	// --Handle data post for new DSR to API--
	const handlePost = async (event) => {
		try {
			event.preventDefault();
			const response = await fetch(
				"https://new-web-app.onrender.com/add_dsr/",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(dsrData),
				}
			);

			const data = await response.json();
			// Clearing form after Submission
			setMsgToShow("DSR-Saved");
			data.errors ? errMsg() : verificationMsg();
			handleClear();
			setTimeout(closeMsg, 2500);
		} catch (error) {
			setMsgToShow("DSR-Not-Saved");
			errorMsg();
			setTimeout(closeMsg, 2500);
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (validateForm()) {
			handlePost(event);
		}
	};

	// --End of Posting New DSR Data--

	// Clearing the input
	const handleClear = () => {
		setDsrData({
			...dsrData,
			projectName: "",
			clientManager: "",
			activitiesCompleted: "",
			activitiesPlanned: "",
			hoursWorked: "",
			status: "",
			comment: "",
			openIssues: "",
		});

		setDraftData({
			...dsrData,
			projectName: "",
			clientManager: "",
			activitiesCompleted: "",
			activitiesPlanned: "",
			hoursWorked: "",
			status: "",
			comment: "",
			openIssues: "",
		});
	};

	// Showing notification on submit data and error
	const [msgToShow, setMsgToShow] = useState();

	const [msg, setMsg] = useState(false);
	const [errMsg, setErrMsg] = useState(false);

	function verificationMsg() {
		setMsg(true);
	}

	function errorMsg() {
		setErrMsg(true);
	}

	function closeMsg() {
		setMsg(false);
		setErrMsg(false);
	}

	// Saving Draft
	const [draftData, setDraftData] = useState({
		date: "2023-04-20T08:33:15.958Z",
		projectName: "",
		clientManager: "",
		activitiesCompleted: "",
		activitiesPlanned: "",
		hoursWorked: "",
		status: "",
		comment: "",
		openIssues: "",
		isOnLeave: false,
		createdAt: "2023-04-20T08:33:15.958Z",
		updatedAt: "2023-04-20T08:33:15.958Z",
		user: userId,
	});

	// Handle Draft Save
	const handleDraft = async (event) => {
		try {
			event.preventDefault();
			const response = await fetch(
				"https://new-web-app.onrender.com/add_draft/",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(draftData),
				}
			);

			const data = await response.json();
			// Clearing form after Submission
			handleClear();
			setMsgToShow("Draft-Saved");
			data.errors ? errMsg() : verificationMsg();
			setTimeout(closeMsg, 2500);
		} catch (error) {
			setMsgToShow("Draft-Not-Saved");
			errorMsg();
			setTimeout(closeMsg, 2500);
		}
	};

	// Handle Leave Mark
	const handleLeave = async () => {
		try {
			const response = await fetch("https://new-web-app.onrender.com/onleave", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ user: userId }),
			});
			const data = await response.json();
			setMsgToShow("Marked-Leave");
			!data ? errMsg() : verificationMsg();
			setTimeout(closeMsg, 2500);
		} catch (error) {
			setMsgToShow("Unmarked-Leave");
			errorMsg();
			setTimeout(closeMsg, 2500);
		}

		setModal(false);
	};

	function handleLeaveBtn() {
		hideModal();
		handleLeave();
	}

	const [modal, setModal] = useState(false);

	useEffect(() => {
		const container = document.querySelector(".container");
		modal
			? document.querySelector(".container").classList.add("remove-scroll")
			: document.querySelector(".container").classList.remove("remove-scroll");
		console.log(container);
	}, [modal]);

	function showModal() {
		setModal(true);
	}

	function hideModal() {
		setModal(false);
	}

	// Form Validation
	const [errors, setErrors] = useState({
		projectName: "",
		clientManager: "",
		hoursWorked: "",
		status: "",
		activitiesCompleted: "",
		activitiesPlanned: "",
		openIssues: "",
		comment: "",
	});

	const validateForm = () => {
		let isValid = true;

		const newErrors = {
			projectName: "",
			clientManager: "",
			hoursWorked: "",
			status: "",
			activitiesCompleted: "",
			activitiesPlanned: "",
			openIssues: "",
			comment: "",
		};

		if (!dsrData.projectName) {
			newErrors.projectName = "Project Name is required.";
			isValid = false;
		}

		if (!dsrData.clientManager) {
			newErrors.clientManager = "Client Manager Name is required.";
			isValid = false;
		}

		if (!dsrData.hoursWorked) {
			newErrors.hoursWorked = "Hours Worked is required.";
			isValid = false;
		} else if (dsrData.hoursWorked < 0) {
			newErrors.hoursWorked = "Hours Worked must be a positive number.";
			isValid = false;
		}

		if (!dsrData.status) {
			newErrors.status = "Project Status is required.";
			isValid = false;
		}

		if (!dsrData.activitiesCompleted) {
			newErrors.activitiesCompleted = "Activities completed today is required.";
			isValid = false;
		}

		if (!dsrData.activitiesPlanned) {
			newErrors.activitiesPlanned =
				"Activities planned for tomorrow is required.";
			isValid = false;
		}

		if (!dsrData.openIssues) {
			newErrors.openIssues = "Open Issues is required.";
			isValid = false;
		}

		if (!dsrData.comment) {
			newErrors.comment = "Any Other Comments is required.";
			isValid = false;
		}

		setErrors(newErrors);

		return isValid;
	};

	return (
		// Adding animated component to make the route change animated -- Adarsh(19-Apr)
		<AnimatedComponent>
			<Helmet>
				<title>Create New DSR | LeafLog-Quadrafort</title>
			</Helmet>

			{/* {isLeave === 0 && ( */}
			<div className="new-dsr">
				{/* Notification Messages */}
				<div className={`verification-cta ${msg ? "show-verification" : ""}`}>
					<h3 className="heading-xs">
						{msgToShow === "DSR-Saved" && "DSR successfully Submitted! 🎉"}
						{msgToShow === "Draft-Saved" && "Draft saved successfully!🎉"}
						{msgToShow === "Marked-Leave" && "Leave Marked for today! 🎉"}
					</h3>
				</div>

				<div
					className={`verification-cta error-cta ${
						errMsg ? "show-verification" : ""
					}`}
				>
					<h3 className="heading-xs">
						{msgToShow === "DSR-Not-Saved" &&
							"DSR was not Saved! We are experiencing some problems! 💀"}
						{msgToShow === "Draft-Not-Saved" &&
							"Draft was not Saved! We are experiencing some problems! 💀"}
						{msgToShow === "Unmarked-Leave" &&
							"Unable to mark leave due to some internal issues! 💀"}
					</h3>
				</div>

				{/* Modal confirmation */}
				<Modal
					btnValue={"Mark Leave"}
					modalHead={"Are you sure to mark leave today?"}
					action={handleLeaveBtn}
					state={modal}
					setState={setModal}
					hideModal={hideModal}
				/>

				<button className="btn btn-dark btn-error" onClick={(e) => showModal()}>
					On Leave
				</button>

				<div className="new-dsr-card">
					<div className="uid-date">
						<h3 className="heading-s">Please Fill Your DSR!</h3>
						<p className="para">
							Date: <span>{currentDate}</span>
						</p>
					</div>

					<div className="form">
						<form className="form login-form">
							<div className="input-row">
								<div className="input__group">
									<input
										type="text"
										placeholder="Project Name"
										id="project-name"
										name="projectName"
										onChange={storeData}
										className={`form__input form-input ${
											errors.projectName ? "invalid-input" : "valid-input"
										}`}
										value={dsrData.projectName}
									/>

									<label
										htmlFor="project-name"
										className="input__label input-label"
									>
										Project Name <sup style={{ color: `red` }}>*</sup>
									</label>

									{errors.projectName && (
										<div className="validation-error">{errors.projectName}</div>
									)}
								</div>

								<div className="input__group">
									<input
										type="text"
										placeholder="Client Manager Name"
										id="client-manager-name"
										name="clientManager"
										onChange={storeData}
										className={`form__input form-input ${
											errors.clientManager ? "invalid-input" : "valid-input"
										}`}
										value={dsrData.clientManager}
									/>

									<label
										htmlFor="client-manager-name"
										className="input__label input-label"
									>
										Client Manager Name <sup style={{ color: `red` }}>*</sup>
									</label>

									{errors.clientManager && (
										<div className="validation-error">
											{errors.clientManager}
										</div>
									)}
								</div>
							</div>

							<div className="input-row">
								<div className="input__group">
									<input
										type="number"
										placeholder="Hours Worked"
										id="hours-worked"
										name="hoursWorked"
										onChange={storeData}
										className={`form__input form-input ${
											errors.hoursWorked ? "invalid-input" : "valid-input"
										}`}
										value={dsrData.hoursWorked}
									/>

									<label
										htmlFor="hours-worked"
										className="input__label input-label"
									>
										Hours Worked <sup style={{ color: "red" }}>*</sup>
									</label>

									{errors.hoursWorked && (
										<div className="validation-error">{errors.hoursWorked}</div>
									)}
								</div>

								<div className="input__group">
									<input
										type="text"
										placeholder="Project Status"
										id="status"
										name="status"
										onChange={storeData}
										className={`form__input form-input ${
											errors.status ? "invalid-input" : "valid-input"
										}`}
										value={dsrData.status}
									/>

									<label htmlFor="status" className="input__label input-label">
										Project Status <sup style={{ color: "red" }}>*</sup>
									</label>

									{errors.status && (
										<div className="validation-error">{errors.status}</div>
									)}
								</div>
							</div>

							<div className="input-row">
								<div className="input__group input__group__area">
									<textarea
										type="text"
										placeholder="Activities completed Today"
										id="activities-today"
										name="activitiesCompleted"
										onChange={storeData}
										className={`form__input form-input ${
											errors.activitiesCompleted
												? "invalid-input"
												: "valid-input"
										}`}
										value={dsrData.activitiesCompleted}
									/>

									<label
										htmlFor="activities-today"
										className="input__label input__label__area input-label"
									>
										Activities completed Today{" "}
										<sup style={{ color: "red" }}>*</sup>
									</label>

									{errors.activitiesCompleted && (
										<div className="validation-error textarea-error">
											{errors.activitiesCompleted}
										</div>
									)}
								</div>

								<div className="input__group input__group__area">
									<textarea
										type="text"
										placeholder="Activities planned for tomorrow"
										id="activities-tomorrow"
										name="activitiesPlanned"
										onChange={storeData}
										className={`form__input form-input ${
											errors.activitiesCompleted
												? "invalid-input"
												: "valid-input"
										}`}
										value={dsrData.activitiesPlanned}
									/>

									<label
										htmlFor="activities-tomorrow"
										className="input__label input__label__area input-label"
									>
										Activities planned for tomorrow{" "}
										<sup style={{ color: "red" }}>*</sup>
									</label>

									{errors.activitiesPlanned && (
										<div className="validation-error textarea-error">
											{errors.activitiesPlanned}
										</div>
									)}
								</div>
							</div>

							<div className="input-row">
								<div className="input__group input__group__area">
									<textarea
										id="open-issues"
										placeholder="Open Issues"
										name="openIssues"
										onChange={storeData}
										className={`form__input form-input ${
											errors.openIssues ? "invalid-input" : "valid-input"
										}`}
										value={dsrData.openIssues}
									/>

									<label
										htmlFor="open-issues"
										className="input__label input__label__area input-label"
									>
										Open Issues <sup style={{ color: "red" }}>*</sup>
									</label>

									{errors.openIssues && (
										<div className="validation-error textarea-error">
											{errors.openIssues}
										</div>
									)}
								</div>

								<div className="input__group input__group__area">
									<textarea
										id="comment"
										placeholder="Any Other Comments"
										name="comment"
										onChange={storeData}
										className={`form__input form-input ${
											errors.comment ? "invalid-input" : "valid-input"
										}`}
										value={dsrData.comment}
									/>

									<label
										htmlFor="comment"
										className="input__label input__label__area input-label"
									>
										Any Other Comments <sup style={{ color: "red" }}>*</sup>
									</label>

									{errors.comment && (
										<div className="validation-error textarea-error">
											{errors.comment}
										</div>
									)}
								</div>
							</div>

							<div className="input-row btn-row">
								<button
									type="submit"
									className="btn btn-dark"
									onClick={handleSubmit}
								>
									Submit
								</button>

								<button
									className="btn btn-dark btn-warning"
									type="button"
									onClick={handleDraft}
								>
									Save as Draft
								</button>

								<button
									type="button"
									className="btn btn-dark btn-error"
									onClick={handleClear}
								>
									Clear
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			{/* )} */}
		</AnimatedComponent>
	);
}

export default NewDsr;
