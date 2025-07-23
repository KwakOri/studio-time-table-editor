import html2canvas from "html2canvas";
import React, { useState } from "react";

interface Data {
  day: number;
  isHoliday: boolean;
  time: string;
}

const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

const LegacyTimeTableEditor: React.FC = () => {
  const [scale, setScale] = useState(0.5);
  const [data, setData] = useState<Data[]>([
    { day: 0, isHoliday: false, time: "09:00" },
    { day: 1, isHoliday: false, time: "09:00" },
    { day: 2, isHoliday: false, time: "09:00" },
    { day: 3, isHoliday: false, time: "09:00" },
    { day: 4, isHoliday: false, time: "09:00" },
    { day: 5, isHoliday: false, time: "09:00" },
    { day: 6, isHoliday: false, time: "09:00" },
  ]);

  console.log(data);

  const downloadImage = () => {
    const timetable = document.getElementById("timetable");
    if (!timetable) return;

    html2canvas(timetable, {
      width: 1280,
      height: 720,
      scale: 1,
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "weekly-timetable.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const containerWidth = 1280 * scale;
  const containerHeight = 720 * scale;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full p-4 flex justify-between">
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-600 font-medium">
            미리보기 배율: {scale.toFixed(1)}x
          </label>
          <input
            type="range"
            min={0.3}
            max={2}
            step={0.1}
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-64"
          />
        </div>
        <button
          onClick={downloadImage}
          className="px-4 py-2 bg-[#4e4d71] text-white rounded hover:bg-[#3d3d59]"
        >
          이미지로 저장 (1280x720)
        </button>
      </div>
      <div className="flex grow">
        <div className="w-full x-full flex justify-center items-center">
          {/* 미리보기 컨테이너 */}

          <div
            className="border rounded shadow bg-gray-50 w-full h-full"
            style={{
              width: containerWidth,
              height: containerHeight,
              transition: "width 0.3s, height 0.3s",
              overflow: "visible",
            }}
          >
            <div
              id="timetable"
              className="w-[1280px] h-[720px] bg-white box-border text-[26px] select-none font-sans origin-top-left [transform-style:preserve-3d] overflow-hidden relative"
              style={{
                transform: `scale(${scale})`,
              }}
            >
              <div className="w-full h-full bg-[#5868a2] flex flex-col">
                <div className=" absolute left-20 top-20 -rotate-6 w-[640px] h-[640px] bg-[#4a5889] grid grid-cols-3 grid-rows-3 gap-[10px] justify-center items-center rounded-md z-20">
                  <div></div>
                  <div></div>

                  {data.map((time) => (
                    <div
                      key={time.day}
                      className="bg-[#3a466e] w-full h-full flex flex-col justify-center items-center"
                    >
                      <p className="text-white text-center">
                        {weekdays[time.day]}
                      </p>
                      <p className="text-white text-center">
                        {time.isHoliday ? "휴방" : time.time}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="h-[720px] w-[540px] bg-[#4a5889] absolute right-20 top-10 rotate-10 z-10 rounded-md flex justify-center items-center text-white">
                  프로필 이미지 자리
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/4 h-full">
          <div className="flex flex-col gap-2">
            {data.map((day, index) => (
              <div
                key={day.day}
                className="flex justify-center items-center gap-4 p-4 w-full h-full bg-gray-100"
              >
                <p>{day.day}</p>
                <button
                  className={`bg-gray-300 rounded-md p-2 cursor-pointer hover:brightness-90 ${
                    day.isHoliday ? "bg-gray-600 text-white" : ""
                  }`}
                  onClick={() => {
                    const newData = [...data];
                    newData[index].isHoliday = !newData[index].isHoliday;
                    setData(newData);
                  }}
                >
                  휴일
                </button>
                <div>
                  {/* <label
                    className="bg-gray-300 rounded-md p-2 cursor-pointer hover:bg-gray-400"
                    htmlFor={`time-${index}`}
                  >
                    {day.time}
                  </label> */}
                  <input
                    id={`time-${index}`}
                    type="time"
                    className="w-full bg-gray-200 rounded-md p-2"
                    value={day.time}
                    onChange={(e) => {
                      const newData = [...data];
                      newData[index].time = e.target.value;
                      setData(newData);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4 justify-center items-center py-8">
            <div>
              <label
                htmlFor="file-upload"
                className="p-2 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer"
              >
                사진 업로드
              </label>
              <input id="file-upload" type="file" className="hidden" />
            </div>
            <div className="w-40 bg-[#2d2d2d] aspect-video text-white rounded-md flex justify-center items-center">
              미리보기 화면
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegacyTimeTableEditor;
