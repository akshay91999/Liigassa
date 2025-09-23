"use client";
import { useState, ChangeEvent, FormEvent } from "react";

export default function PlayerRegister() {
  const [formData, setFormData] = useState({
    fullname: "",
    dob: "",
    email: "",
    phone: "",
    position: "",
    place: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // 🔹 Handle input/select changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Handle image upload
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🔹 Handle form submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key as keyof typeof formData]);
    });
    if (image) form.append("image", image);

    const res = await fetch("/api/register", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    alert(data.message || data.error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b2040] via-[#111827] to-[#a90a18] px-4 pt-28 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[#a90a18] to-[#fff8db] bg-clip-text text-transparent mb-8">
          Player Registration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          {[
            { name: "fullname", type: "text", placeholder: "Full Name" },
            { name: "dob", type: "date", placeholder: "Date of Birth" },
            { name: "email", type: "email", placeholder: "Email" },
            { name: "phone", type: "tel", placeholder: "Phone Number" },
            { name: "place", type: "text", placeholder: "Place" },
          ].map((field, i) => (
            <div key={i} className="relative">
              <label
                className="absolute -top-2 left-3 bg-[#0b2040] px-2 text-xs text-gray-300 rounded"
              >
                {field.placeholder}
              </label>
              <input
                type={field.type}
                name={field.name}
                onChange={handleChange}
                value={formData[field.name as keyof typeof formData]}
                className="w-full px-4 py-3 bg-transparent text-white rounded-lg border border-gray-400 
               focus:outline-none focus:ring-2 focus:ring-[#a90a18] focus:border-transparent transition-all"
              />
            </div>

          ))}

          {/* Position Options */}
          <div className="relative">
            <label
              className="absolute -top-2 left-3 bg-[#0b2040] px-2 text-xs text-gray-300 rounded"
            >
              Position
            </label>
            <div role="radiogroup" aria-label="Position" className="grid grid-cols-2 gap-3">
              {[
                { label: "Forward", value: "Forward" },
                { label: "Midfielder", value: "Midfielder" },
                { label: "Defender", value: "Defender" },
                { label: "Keeper", value: "Keeper" },
              ].map((opt) => {
                const selected = formData.position === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setFormData({ ...formData, position: opt.value })}
                    className={`w-full px-4 py-3 rounded-lg border transition-all text-left
                    ${selected
                      ? "border-white/60 bg-white/10 ring-2 ring-[#a90a18] text-white"
                      : "border-gray-400 text-gray-200 hover:border-white/60 hover:bg-white/5"}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{opt.label}</span>
                      <span
                        className={`h-2.5 w-2.5 rounded-full border
                        ${selected ? "bg-[#a90a18] border-[#a90a18]" : "border-gray-400"}`}
                        aria-hidden="true"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image Upload */}
          <div className="relative">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0 file:text-sm file:font-semibold
              file:bg-gradient-to-r file:from-[#a90a18] file:to-[#0b2040] file:text-white
              hover:file:opacity-80 cursor-pointer"
            />
            {preview && (
              <div className="mt-3 flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-24 w-24 object-cover rounded-full border-2 border-[#a90a18] shadow-md"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#a90a18] to-[#0b2040] 
            text-white font-semibold tracking-wide shadow-lg transform hover:scale-105 transition-all"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
