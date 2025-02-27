"use client";
import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import CryptoJS from "crypto-js";
import { Button } from "./ui/button";

const QrCodeGenerator = () => {
  const [qrData, setQrData] = useState("");
  const [randomNumber, setRandomNumber] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);
  const generateQRCode = () => {
    const newRandomNumber = Math.floor(100000 + Math.random() * 900000);

    const encryptedToken = CryptoJS.AES.encrypt("secure-access", "secret-key").toString();

    const qrObject = {
      token: encryptedToken,
      number: newRandomNumber.toString(),
      isExpired: false,
    };

    setQrData(JSON.stringify(qrObject));
  };
  return (
    <div className="bg-black text-white w-screen h-screen flex items-center justify-center ">
      <div className="w-full h-full py-5 px-10 flex flex-col gap-5">
        <h1 className="text-xl font-bold mb-36">QrCodeGen-Gov</h1>
        <div className="flex flex-col justify-around h-full">
          <div className="flex flex-col justify-center items-center">
        <p className="text-stone-400 mb-5 text-center">
          QrCodeGen-Gov is a government-owned authentication tool for secure
          admin access to government platforms. Sharing generated QR codes or
          links is strictly prohibited.
        </p>
        <Button onClick={generateQRCode} className="bg-white text-black hover:text-white">Generate New QR Code</Button>
        </div>
        <p className="text-center font-bold justify-self-end">
          &copy; {new Date().getFullYear()}. QrCodeGen-Gov All Rights Reserved.
        </p>
        </div>
      </div>
      <div className="w-full bg-stone-100 text-stone-900 h-full flex flex-col justify-center items-center">
        <div>
          {qrData && !isExpired ? (
            <>
              <QRCodeSVG value={qrData} size={256} />
            </>
          ) : (
            <p className="italic">QR Code Expired/Not Generated</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QrCodeGenerator;
