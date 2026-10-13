
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { aiService } from "../../../services/ai-service";
import { notify } from "../../../utils/notify";
import "./ai-recommendation.css";

export function AiRecommendation() {

    const [destination, setDestination] = useState<string>("");
    const [recommendation, setRecommendation] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    async function getRecommendation() {
        try {

            // Prevent sending an empty destination to the backend.
            if (!destination.trim()) {
                notify.error("Please enter a destination.");
                return;
            }

            // Start loading and clear the previous recommendation.
            setLoading(true);
            setRecommendation("");

            const recommendation = await aiService.getRecommendation(destination);

            setRecommendation(recommendation);
        }
        catch(err: any) {
            notify.error(err);
        }
        finally {
            // Stop loading whether the request succeeds or fails.
            setLoading(false);
        }
    }

    return (
        <div className="AiRecommendation">

            <div className="ai-card">

                <div className="ai-title">
                    <h2>AI Travel Assistant</h2>
                    <p>Enter a destination and let GoVista prepare a travel recommendation for you.</p>
                </div>

                <div className="ai-form">

                    <label>Destination</label>

                    <input
                        type="text"
                        value={destination}
                        onChange={e => setDestination(e.target.value)}
                        placeholder="e.g. Tokyo, Japan"
                    />

                    <button onClick={getRecommendation} disabled={loading}>
                        {loading ? "Preparing Recommendation..." : "Get Recommendation"}
                    </button>

                </div>

                {/* Render the AI response as formatted Markdown when available. */}
                {recommendation &&
                    <div className="recommendation">

                        <div className="result-title">
                            <span>GoVista Recommendation</span>
                        </div>

                        <div className="recommendation-content">
                            <ReactMarkdown>{recommendation}</ReactMarkdown>
                        </div>

                    </div>
                }

            </div>

        </div>
    );
}
