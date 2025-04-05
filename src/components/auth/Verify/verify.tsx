import { useState, useRef } from "react";
import { Avatar, Button } from "@mui/material";
import { CiLock } from "react-icons/ci";

const Verify = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^[a-zA-Z0-9]?$/.test(value)) return; // Chỉ cho phép chữ & số

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Tự động chuyển sang input tiếp theo nếu nhập ký tự
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    inputsRef.current[0]?.focus();
  };

  const charactersLeft = 6 - otp.filter((d) => d !== "").length;
  const isFull = charactersLeft === 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-sm">
        {/* Phần Header + Icon */}
        <div className="flex flex-col items-center mb-6">
          <Avatar sx={{ bgcolor: "primary.main", width: 100, height: 100, mb: 4 }}>
            <CiLock style={{ fontSize: 46 }} />
          </Avatar>
          <h1 className="text-2xl font-bold">Easy Peasy</h1>
          <p className="text-gray-600 mt-2 text-center">Enter 6 characters to verify your account.</p>
        </div>

        {/* Các ô nhập mã OTP */}
        <div className="flex justify-center gap-2 mb-4">
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={value}
              ref={(el) => { inputsRef.current[index] = el!; }}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-10 h-10 text-center border-b-2 border-gray-300 text-xl focus:outline-none"
            />
          ))}
        </div>

        {/* Nút Verify */}
        <Button variant="contained" color="primary" fullWidth disabled={!isFull}>
        {isFull ? "Verify" : `${charactersLeft} digits left`}
        </Button>

        {/* Nút Resend */}
        <Button variant="text" className="!mt-4" fullWidth onClick={handleResend}>
          Resend
        </Button>
      </div>
    </div>
  );
};

export default Verify;
