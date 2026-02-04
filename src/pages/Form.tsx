import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Autocomplete  
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { getRates } from "../services/currency.api";

const Form: React.FC = () => {

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("PKR");

  const [rates, setRates] = useState<any>({});
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Load Rates
  useEffect(() => {
    loadRates();
  }, [fromCurrency]);

  const loadRates = async () => {
    try {
      const data = await getRates(fromCurrency);

      setRates(data);
      setCurrencies(Object.keys(data)); // All currencies

    } catch {
      setError("API Error");
    }
  };

  // Submit// States mein ye add karein
  const [status, setStatus] = useState<"error" | "success">("error");

  // Submit logic update karein
  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Empty fields check
    if (!name || !amount) {
      setStatus("error");
      setError("Please fill all fields");
      return;
    }

    // Same currency check
    if (fromCurrency === toCurrency) {
      setStatus("error");
      setError("Source and target currencies cannot be the same!");
      return;
    }

    // Agar sab theek hai:
    const rate = rates[toCurrency];
    const converted = (Number(amount) * rate).toFixed(2);

    const newEntry = {
      userId: Date.now(),
      name,
      fromCurrency,
      toCurrency,
      realAmount: amount,
      rate: rate,
      amount: converted,
      date: new Date().toLocaleString()
    };

    const old = JSON.parse(localStorage.getItem("exchangeData") || "[]");
    localStorage.setItem("exchangeData", JSON.stringify([newEntry, ...old]));
  
      navigate("/dashboard");
    
  };

  return (

    <Container sx={{ mt: 10, width: 400 }}>

      <Paper sx={{ p: 4 }}>

        <Typography align="center" mb={3}>
          💱 Currency Converter
        </Typography>

        {error && <Alert
          severity={status}  
          sx={{ mb: 2 }}
           
        >{error}</Alert>}

        <form onSubmit={handleSubmit}>

          <Grid container spacing={2}>

            {/* Name */}
            <Grid size={{ xs: 12 }} sx={{mt:1.5}}>
              <TextField
                fullWidth
                size="small"
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>

            {/* Amount */}
            <Grid size={{ xs: 12 }} sx={{mt:1.5}}>
              <TextField
                fullWidth
                size="small"
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Grid>

            {/* From */}
            <Grid size={{ xs: 6 }} sx={{mt:1.5}}>
              <Autocomplete
                size="small"
                options={currencies}
                value={fromCurrency}
                onChange={(_, v) => setFromCurrency(v || "USD")}
                renderInput={(params) => (
                  <TextField {...params} label="From" />
                )}
              />
            </Grid>

            {/* To */}
            <Grid size={{ xs: 6 }} sx={{mt:1.5}}>
              <Autocomplete
                size="small"
                options={currencies}
                value={toCurrency}
                onChange={(_, v) => setToCurrency(v || "PKR")}
                renderInput={(params) => (
                  <TextField {...params} label="To" />
                )}
              />
            </Grid>

            {/* Button */}
            <Grid  size={{ xs: 12 }} sx={{mt:1.5}}>
              <Button fullWidth size="small" type="submit" variant="contained">
                Convert
              </Button>
            </Grid>

          </Grid>

        </form>

      </Paper>

    </Container>
  );
};

export default Form;
