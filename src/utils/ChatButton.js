import { Chat } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Fade,
} from "@mui/material";
import React, { useState, useContext } from "react";
import { LanguageContext } from "./LanguageContext";

const ChatButton = () => {
  // Your business WhatsApp number (in international format without '+' or '00')
  const businessNumber = "8801571048971";
  const { language } = useContext(LanguageContext);

  // Translations
  const translations = {
    english: {
      defaultMessage: "Hello! I have a question about your products.",
      chatWithUs: "Chat with Us",
      helpText: "We're here to help! Send us a message on WhatsApp.",
      sendMessage: "Send Message",
      chatButton: "Chat with us",
    },
    bangla: {
      defaultMessage: "হ্যালো! আমার আপনার পণ্য সম্পর্কে একটি প্রশ্ন আছে।",
      chatWithUs: "আমাদের সাথে চ্যাট করুন",
      helpText:
        "আমরা সাহায্য করতে এখানে আছি! হোয়াটসঅ্যাপে আমাদের একটি বার্তা পাঠান।",
      sendMessage: "বার্তা পাঠান",
      chatButton: "আমাদের সাথে চ্যাট করুন",
    },
  };

  const t = translations[language];

  // Default message (can be customized)
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState(t.defaultMessage);

  const handleChatSubmit = () => {
    const whatsappUrl = `https://wa.me/${businessNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
    setIsChatOpen(false);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 30,
        right: 20,
        zIndex: 1000,
      }}
    >
      <Fade in={isChatOpen} timeout={300}>
        <Card
          sx={{
            width: 300,
            position: "absolute",
            bottom: 60,
            right: 0,
            boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
            borderRadius: "12px",
            display: isChatOpen ? "block" : "none",
            zIndex: 1001,
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold", color: "var(--primary-blue-dark)" }}
            >
              {t.chatWithUs}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {t.helpText}
            </Typography>

            <TextField
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                onClick={handleChatSubmit}
                startIcon={<Chat />}
                sx={{
                  backgroundColor: "var(--primary-blue-dark)",
                  "&:hover": {
                    backgroundColor: "var(--button-hover)",
                  },
                }}
              >
                {t.sendMessage}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Fade>

      <Button
        variant="contained"
        onClick={toggleChat}
        startIcon={<Chat />}
        size="small"
        sx={{
          backgroundColor: "var(--primary-blue-dark)",
          color: "var(--text-light)",
          padding: "6px 16px",
          borderRadius: "20px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
          textTransform: "none",
          fontWeight: "medium",
          zIndex: 1002,
          "&:hover": {
            backgroundColor: "var(--button-hover)",
          },
        }}
      >
        {t.chatButton}
      </Button>
    </div>
  );
};

export default ChatButton;