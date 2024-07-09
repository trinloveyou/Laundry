import React, { useState } from "react";
import "./Form.css";

const Modal = ({ show, onClose, machine, handlePay }) => {
  const [payment, setPayment] = useState(0);

  const handleAddCoin = (value) => {
    const price = parseInt(machine.price.replace("$", ""));
    if (payment + value <= price) {
      setPayment(payment + value);
    }
  };

  const handleConfirmPayment = () => {
    handlePay(machine.id);
    setPayment(0);
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>เครื่องที่ {machine.id}</h2>
        <p>สถานะ: {machine.status}</p>
        <p>น้ำหนัก: {machine.kilogram}</p>
        <p>ราคา: {machine.price}</p>
        <div className="coin-buttons">
          <button onClick={() => handleAddCoin(1)} disabled={machine.paid}>
            1 บาท
          </button>
          <button onClick={() => handleAddCoin(2)} disabled={machine.paid}>
            2 บาท
          </button>
          <button onClick={() => handleAddCoin(5)} disabled={machine.paid}>
            5 บาท
          </button>
          <button onClick={() => handleAddCoin(10)} disabled={machine.paid}>
            10 บาท
          </button>
        </div>
        <p>จำนวนเงินที่ได้หยอด: {payment} บาท</p>
        {machine.paid ? (
          <p>ชำระเงินแล้ว</p>
        ) : (
          <button
            onClick={handleConfirmPayment}
            disabled={payment < parseInt(machine.price.replace("$", ""))}
          >
            ชำระเงิน
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;