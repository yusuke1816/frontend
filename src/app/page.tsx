"use client";
import React, { useState } from 'react';
import axios from 'axios';

const Page = () => {
    const [file, setFile] = useState<File | null>(null);  // ファイルの状態
    const [pptText, setPptText] = useState<string>('');  // PowerPointから抽出したテキスト

    // イベントオブジェクトの型を明示的に指定
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        setFile(selectedFile);  // 選択されたファイルを保存
    };

    const handleUpload = async () => {
        if (!file) {
            alert("ファイルを選択してください");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);  // フォームデータにファイルを追加

        try {
            // FlaskバックエンドへPOSTリクエストを送信
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setPptText(response.data.ppt_text);  // PowerPointからのテキストを表示
        } catch (error) {
            console.error("エラー:", error);
        }
    };

    return (
        <div>
            <h1>パワーポイントテキスト抽出アプリ</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>アップロードしてテキストを抽出</button>
            {pptText && (
                <div>
                    <h2>抽出されたテキスト:</h2>
                    <pre>{pptText}</pre>
                </div>
            )}
        </div>
    );
};

export default Page;
