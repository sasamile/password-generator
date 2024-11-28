"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FaCopy, FaRandom } from "react-icons/fa";
import React, { useState } from "react";

function GeneratorPage() {
  const [length, setLength] = useState(8);
  const [includeUppercase, setIncludeUppercase] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [generatedValue, setGeneratedValue] = useState("");
  const [type, setType] = useState("password");

  const handleGenerate = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";

    let characters = lowercase;
    if (includeUppercase) characters += uppercase;
    if (includeNumbers) characters += numbers;
    if (includeSymbols) characters += symbols;

    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }

    if (type === "email") {
      result = `${result}@example.com`;
    }

    setGeneratedValue(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedValue);
    alert("Copied to clipboard!");
  };

  return (
    <Card className="p-6 max-w-xl mx-auto shadow-lg rounded-lg dark:bg-[#18181B] ">
      <h2 className="text-center text-2xl font-bold mb-4">
        Password/Username Generator
      </h2>
      <div className="mb-4">
        <Label className="block mb-2">What do you want to generate?</Label>
        <select
    
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            if (e.target.value !== "password") {
              setIncludeUppercase(false);
              setIncludeNumbers(false);
              setIncludeSymbols(false);
            }
          }}
          className="border rounded-md p-2 w-full mb-4  dark:bg-[#212124]"
        >
          <option value="password">Password</option>
          <option value="username">Username</option>
          <option value="email">Email</option>
        </select>
      </div>
      <Label className="block mb-2">Length: {length} characters</Label>
      <input
        type="range"
        min="1"
        max="30"
        value={length}
        onChange={(e) => setLength(Number(e.target.value))}
        className="w-full mb-4"
      />
      {type === "password" && (
        <div className="mb-4 flex flex-col justify-center gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="uppercase"
              checked={includeUppercase}
              onCheckedChange={(checked) => setIncludeUppercase(checked as boolean)}
            />
            <Label htmlFor="uppercase">Include Uppercase</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="numbers"
              checked={includeNumbers}
              onCheckedChange={(checked) => setIncludeNumbers(checked as boolean)}
            />
            <Label htmlFor="numbers">Include Numbers</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="symbols"
              checked={includeSymbols}
              onCheckedChange={(checked) => setIncludeSymbols(checked as boolean)}
            />
            <Label htmlFor="symbols">Include Symbols</Label>
          </div>
        </div>
      )}
      <div className="flex justify-between py-4">
        <Button onClick={handleGenerate} className="flex items-center">
          <FaRandom className="mr-2" /> Generate
        </Button>
        <Button
          onClick={handleCopy}
          disabled={!generatedValue}
          className="flex items-center"
        >
          <FaCopy className="mr-2" /> Copy
        </Button>
      </div>
      <div className="mt-4 text-center">
        <strong>Result:</strong>
        <div className="mt-2 text-lg font-semibold flex-wrap">{generatedValue}</div>
      </div>
    </Card>
  );
}

export default GeneratorPage;

