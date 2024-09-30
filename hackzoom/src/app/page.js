"use client";
import ButtonsContainer from "@/components/ButtonsContainer";
import { useEffect, useState } from "react";

export default function Page() {

  return (
    <div>
      <ButtonsContainer />
      <h1 style={{ 'text-align': 'center' }}>Welcome to <b style={{'color':'#E57373'}}>HackMidTERMS</b>, your on-the-go lecture companion and testing partner!</h1>
      <p style={{ 'text-align': 'center', 'fontFamily': 'Inter Tight', 'fontSize': '2rem', 'color': '#3f3f3f' }}>
        This app helps students test themselves while watching their lectures by providing interactive quizzes and flashcards that can be accessed anytime, anywhere.
      </p>
    </div>
  );
}
