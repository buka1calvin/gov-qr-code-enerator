"use client";
import React, { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import CryptoJS from "crypto-js";
import { Button } from "./ui/button";
import html2canvas from "html2canvas";

const QrCodeGenerator = () => {
  const [qrData, setQrData] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const generateQRCode = () => {
    const newRandomNumber = Math.floor(100000 + Math.random() * 900000);

    const encryptedToken = CryptoJS.AES.encrypt(
      "secure-access",
      "secret-key"
    ).toString();

    const qrObject = {
      token: encryptedToken,
      number: newRandomNumber.toString(),
      isExpired: false,
    };

    setQrData(JSON.stringify(qrObject));
    setIsExpired(false);
  };

  useEffect(() => {
    generateQRCode();
  }, []);

  const downloadQRCode = async () => {
    if (qrRef.current) {
      const canvas = await html2canvas(qrRef.current);
      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = image;
      link.download = "QRCode.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const shareViaWhatsApp = async () => {
    if (qrRef.current) {
      const canvas = await html2canvas(qrRef.current);
      const imageData = canvas.toDataURL("image/png");

      const blob = await fetch(imageData).then((res) => res.blob());
      const file = new File([blob], "QRCode.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: "QR Code",
            text: "Scan this QR Code",
            files: [file],
          });
        } catch (error) {
          console.error("Error sharing QR Code", error);
        }
      } else {
        // Fallback: Open WhatsApp manually with a text link
        const message = encodeURIComponent("Here is your QR Code:");
        const whatsappLink = `https://wa.me/?text=${message}`;
        window.open(whatsappLink, "_blank");
      }
    }
  };

  return (
    <div className="bg-black text-white w-screen h-screen flex md:flex-row flex-col items-center justify-center ">
      <div className="w-full h-full py-5 px-10 md:flex hidden flex-col gap-5">
        <h1 className="text-xl font-bold mb-36">QrCodeGen-Gov</h1>
        <div className="flex flex-col justify-around h-full">
          <div className="flex flex-col justify-center items-center">
            <p className="text-stone-400 mb-5 text-center">
              QrCodeGen-Gov is a government-owned authentication tool for secure
              admin access to government platforms. Sharing generated QR codes
              or links is strictly prohibited.
            </p>
            <Button
              onClick={generateQRCode}
              className="bg-white text-black hover:text-white"
            >
              Generate New QR Code
            </Button>
          </div>
          <p className="text-center font-bold justify-self-end">
            &copy; {new Date().getFullYear()}. QrCodeGen-Gov All Rights
            Reserved.
          </p>
        </div>
      </div>
      <div className="w-full p-3 md:hidden block">
        <h1 className="text-xl font-bold text-left">QrCodeGen-Gov</h1>
      </div>
      <div className="w-full relative bg-stone-100 text-stone-900 h-full flex flex-col justify-center items-center">
        <div ref={qrRef} className="relative ">
          <button
            onClick={generateQRCode}
            className="absolute -top-10 right-0 bg-green-600 text-white px-3 py-1 md:hidden block"
          >
            generate
          </button>
          {qrData && !isExpired ? (
            <QRCodeSVG value={qrData} size={256} className="w-64 h-64" />
          ) : (
            <p className="italic">QR Code Expired/Not Generated</p>
          )}
        </div>
        <div className="mt-5 flex flex-col gap-4">
          <Button onClick={downloadQRCode} className="">
            Download QR Code
          </Button>
          <Button
            onClick={shareViaWhatsApp}
            className="bg-white text-black hover:text-white"
          >
            Share via WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QrCodeGenerator;
