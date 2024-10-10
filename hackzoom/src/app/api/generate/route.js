import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req){
    try{
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const {text, questionType} = await req.json();
        console.log("Request Body: ", text, questionType);

        let systemMessage;
        let jsonOutput = {};

        if (questionType === '1'){
            systemMessage = "You are an AI assistant tasked with generating one thoughtful one-line questions based on the information provided in the given paragraph." +
            "Please provide both the question and the correct answer, and label the correct answer explicitly like this: 'Correct answer: <answer>'." + 
            "Both the question and the answer should be no more than 14 words long.";
        } else if (questionType === '2'){
            systemMessage = "You are an AI assistant tasked with generating one multiple-choice question based on the information provided in the given paragraph." +
            "Please provide the question, four possible answers, and label the correct answer explicitly like this: 'Correct answer: <answer>'." + 
            "The question and each answer should be no more than 14 words long.";
        } else {
            return NextResponse.json({error: "Invalid question type."}, {status: 400});
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-4-turbo', // Use the turbo model for efficiency
            messages: [
              { role: 'system', content: systemMessage },
              { role: 'user', content: text}
            ]
          });

        const generatedContent = completion.choices[0].message.content.trim();
        console.log("Completion: ", completion);
        console.log("Generated Content: ", generatedContent);

        if (questionType === '1'){
            const lines = generatedContent.split('\n').filter(line => line.trim() !== '' );

            const questionWords = lines[0].split(' ').slice(0,14).join(' ');
            const correctAnswerLine = lines.find(line => line.startsWith('Correct answer:'));
            const answerWords = correctAnswerLine ? correctAnswerLine.replace('Correct answer: ', '').split(' ').slice(0,14).join(' ') : 'Unknown';

            jsonOutput = {
                type: 'flash',
                question: questionWords,
                answer: answerWords,
            };
        } else if (questionType === '2'){
            const lines = generatedContent.split('\n').filter(line => line.trim() !== '' );
            const questionWords = lines[0].split(' ').slice(0,14).join(' ');
            const options = lines.slice(1,5);
            const correctAnswerLine = lines.find(line => line.startsWith('Correct answer:'));

            const answerWords = correctAnswerLine ? correctAnswerLine.replace('Correct answer: ', '').split(' ').slice(0,14).join(' ') : 'Unknown';

            jsonOutput = {
                type: 'multiple',
                question: questionWords,
                option1: options[0] || 'Option 1',
                option2: options[1] || 'Option 2',
                option3: options[2] || 'Option 3',
                option4: options[3] || 'Option 4',
                answer: answerWords,
            };
        }
        return NextResponse.json(jsonOutput);
    } catch (error){
        console.error('Error generating quiz card:', error);
        return NextResponse.json({error: 'Error generating quiz card.'}, {status: 500});0
    } finally{
        console.log("Quiz Card Generated.");
    }
}