import React, { useState, useEffect } from 'react';
import { Button } from "./@/components/ui/button"
import { Progress } from "./@/components/ui/progress"
import { Input } from "./@/components/ui/input"

const App = () => {
  const [progress, setProgress] = useState(0);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [progressstr, setProgressstr] = useState('');
  const [progressBarVisible, setProgressBarVisible] = useState(false);
  const [downloadButtonVisible, setDownloadButtonVisible] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [inputValue, setInputValue] = useState('apples');



  useEffect(() => {
    if (!taskId) return;

    const intervalId = setInterval(async () => {
      const progressResponse = await fetch(`https://blarskdgs.site/progress/${taskId}`);
      const progressData = await progressResponse.json();

      if (progressData.progress === 'Video generation complete.') {
        clearInterval(intervalId);
        OnEnd()
      } else if(Number.isInteger(progressData.progress)) {
        setProgress(progressData.progress);
        setProgressstr("Compiling video... (This may take a minute)")
      }
      else if (progressData.progress !== "null"){
        setProgressstr(progressData.progress)
      }
    }, 5000); //Time interval for checking progress

    return () => clearInterval(intervalId); 
  }, [taskId]);

  
  const handleGeneration = async () => {
    setButtonVisible(false); 
    setProgressBarVisible(true);
    const url = 'https://blarskdgs.site/generate_video'; 
    let query = url +'?about=' + inputValue

    const response = await fetch(query, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setTaskId(data.task_id);

  };
  const OnEnd = () => {
    setProgressBarVisible(false);
    setDownloadButtonVisible(true);
    setProgressstr("Ready to Download");

  };
  const handleVideoDownload = () => {
    window.location.href = 'https://blarskdgs.site/download_video'; 
  };
  const handleInput = (event: { target: { value: React.SetStateAction<string>; }; }) =>{
    setInputValue(event.target.value);
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">AI Assisted Video Fact Generator</h1>
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md">
        <h5 className="text-xl font-bold mb-4">Generate an AI assisted 30-45 second clip on an interesting fact!</h5>
        <Input
          type="text"
          value={inputValue}
          onChange={handleInput}
          className="w-full px-4 py-2 mb-4 border border-gray-700 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your topic"
        />
        {progressBarVisible && (
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        )}
        {buttonVisible && (
          <Button
            onClick={handleGeneration}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 mb-2"
          >
            Start Generation
          </Button>
        )}
        {downloadButtonVisible && (
          <Button
            onClick={handleVideoDownload}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 mb-2"
          >
            Download Video
          </Button>
        )}
        <p className="mt-4 text-gray-400">{progressstr}</p>
      </div>
    </div>
  );
};

export default App;

