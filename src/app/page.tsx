"use client";
import React, { useState } from 'react';
import axios from 'axios';

const Page = () => {
    const [file, setFile] = useState<File | null>(null);  // 選択されたファイルの状態
    const [pptText, setPptText] = useState<string>('');  // PowerPointから抽出したテキスト
    const [isLoading, setIsLoading] = useState<boolean>(false);  // ローディング状態
    const [error, setError] = useState<string | null>(null);  // エラーメッセージ

    // ファイルが選択されたときのイベントハンドラー
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        setFile(selectedFile);  // 選択されたファイルを保存
        setPptText('');  // 前回のテキストをクリア
        setError(null);  // エラーメッセージをクリア
    };

    // アップロードボタンがクリックされたとき
    const handleUpload = async () => {
        if (!file) {
            setError("ファイルを選択してください");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);  // フォームデータにファイルを追加

        setIsLoading(true);  // ローディング状態をオン
        setError(null);  // エラーメッセージをリセット

        try {
            // FlaskバックエンドへPOSTリクエストを送信
            const response = await axios.post('http://localhost:5001/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // 応答が成功した場合、抽出したテキストを表示
            if (response.data.ppt_text) {
                setPptText(response.data.ppt_text);  // PowerPointから抽出したテキストを状態に保存
            } else {
                setError("PowerPointからテキストが抽出されませんでした。");
            }
        } catch (error: any) {
            console.error("エラー:", error);
            setError("ファイルのアップロード中にエラーが発生しました。もう一度試してください。");  // エラーメッセージを表示
        } finally {
            setIsLoading(false);  // ローディング状態をオフ
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>PowerPointテキスト抽出アプリ</h1>

            {/* ファイル選択の入力 */}
            <input 
                type="file" 
                onChange={handleFileChange} 
                accept=".pptx" 
                style={{ marginBottom: '20px', width: '100%' }} 
            />
            <br />
            {/* アップロードボタン */}
            <button 
                onClick={handleUpload} 
                disabled={isLoading} 
                style={{ marginBottom: '20px', padding: '10px 20px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
            >
                {isLoading ? 'アップロード中...' : 'アップロードしてテキストを抽出'}
            </button>

            {/* エラーメッセージ */}
            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

            {/* 抽出したテキストの表示 */}
            {pptText && (
                <div>
                    <h2>抽出されたテキスト:</h2>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: '400px', overflowY: 'auto' }}>
                        {pptText}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default Page;
