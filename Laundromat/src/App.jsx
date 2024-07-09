import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Modal from "./Form"; // Import the Modal component
import { GiWashingMachine } from "react-icons/gi";
import {
  IoIosCheckmarkCircleOutline,
  IoIosCloseCircleOutline,
} from "react-icons/io";

const LINE_NOTIFY_TOKEN = "czDvmaPeIqOxqJGjQaV8OQZGrWX7sPi8CWeoa97MfwO";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [machines, setMachines] = useState([
    {
      id: 1,
      status: "ว่าง",
      kilogram: "8 กิโลกรัม",
      price: "40$",
      paid: false,
    },
    {
      id: 2,
      status: "ว่าง",
      kilogram: "8 กิโลกรัม",
      price: "40$",
      paid: false,
    },
    {
      id: 3,
      status: "ว่าง",
      kilogram: "8 กิโลกรัม",
      price: "40$",
      paid: false,
    },
    {
      id: 4,
      status: "ว่าง",
      kilogram: "8 กิโลกรัม",
      price: "40$",
      paid: false,
    },
    {
      id: 5,
      status: "ว่าง",
      kilogram: "8 กิโลกรัม",
      price: "40$",
      paid: false,
    },
    {
      id: 6,
      status: "ว่าง",
      kilogram: "8 กิโลกรัม",
      price: "40$",
      paid: false,
    },
  ]);

  const handleClick = (machine) => {
    setSelectedMachine(machine);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMachine(null);
  };

  const updateMachineStatus = (machineId, status, paid, countdownTime) => {
    setMachines((prevMachines) =>
      prevMachines.map((machine) =>
        machine.id === machineId
          ? {
              ...machine,
              status: status,
              paid: paid,
              countdownTime: countdownTime,
            }
          : machine
      )
    );
  };

  const handlePay = (machineId) => {
    updateMachineStatus(machineId, "กำลังซัก", true, 80);
    setShowModal(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setMachines((prevMachines) =>
        prevMachines.map((machine) => {
          if (machine.countdownTime > 0) {
            const newTime = machine.countdownTime - 1;
            if (newTime === 60 && machine.paid) {
              sendLine(machine.id, newTime);
            }
            return { ...machine, countdownTime: newTime };
          } else if (machine.countdownTime === 0 && machine.paid) {
            return {
              ...machine,
              status: "ว่าง",
              paid: false,
              countdownTime: null,
            };
          }
          return machine;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const sendLine = (machineId, countdownTime) => {
    const message = `เครื่องที่ ${machineId} กำลังซักเสร็จในอีก ${countdownTime} วินาที`;
    axios
      .post("http://localhost:3001/proxy", {
        message,
        token: LINE_NOTIFY_TOKEN,
      })
      .then((response) => {
        console.log("Message sent:", response.data);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  return (
    <div className="container">
      <h2>ร้านซักผ้าอัตโนมัติ</h2>
      {machines.map((machine) => (
        <div
          key={machine.id}
          className="content"
          onClick={() => handleClick(machine)}
        >
          <GiWashingMachine size={57} />
          <p className="wash">เครื่องที่ {machine.id}</p>
          <div className="checkmark-container">
            {machine.paid ? (
              <IoIosCloseCircleOutline size={25} className="checkmark-icon" />
            ) : (
              <IoIosCheckmarkCircleOutline
                size={25}
                className="checkmark-icon"
              />
            )}
            <p className="free">{machine.status}</p>
            <p className="kilogram">{machine.kilogram}</p>
            <p className="price">
              {machine.paid
                ? machine.countdownTime === 0
                  ? "เสร็จสิ้น"
                  : `${machine.countdownTime} วินาที`
                : `${machine.price}`}
            </p>
          </div>
        </div>
      ))}
      {selectedMachine && (
        <Modal
          show={showModal}
          onClose={closeModal}
          machine={selectedMachine}
          handlePay={handlePay}
        />
      )}
    </div>
  );
}

export default App;
