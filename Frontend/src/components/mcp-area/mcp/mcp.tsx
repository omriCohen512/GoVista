
import { useState } from "react";
import { mcpService } from "../../../services/mcp-service";
import { notify } from "../../../utils/notify";
import "./mcp.css";

export function Mcp() {

    const [question, setQuestion] = useState<string>("");
    const [answer, setAnswer] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    async function ask() {
        try {

            // Prevent sending an empty question.
            if (!question.trim()) {
                notify.error("Please enter a question.");
                return;
            }

            // Clear the previous answer and start loading.
            setLoading(true);
            setAnswer("");

            // Send the question to the backend through the MCP service.
            const answer = await mcpService.ask(question);

            setAnswer(answer);
        }
        catch (err: any) {
            notify.error(err);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="Mcp">

            <div className="mcp-card">

                <div className="mcp-title">
                    <h2>Vacation Database Assistant</h2>
                    <p>Ask GoVista questions about the vacations currently stored in the system.</p>
                </div>

                <div className="mcp-form">

                    <label>Question</label>

                    <input
                        type="text"
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        placeholder="e.g. Which vacation has the most likes?"
                    />

                    <button onClick={ask} disabled={loading}>
                        {loading ? "Searching..." : "Ask GoVista"}
                    </button>

                </div>

                <div className="question-examples">
                    <span>Example questions</span>

                    <p>How many vacations are active right now?</p>
                    <p>What is the average vacation price?</p>
                    <p>Which vacation has the most likes?</p>
                    <p>Show me vacations between $500 and $1500.</p>
                </div>

                {/* Display the answer only after receiving a response. */}
                {answer &&
                    <div className="answer">
                        <div className="result-title">
                            <span>GoVista Answer</span>
                        </div>

                        <p>{answer}</p>
                    </div>
                }

            </div>

        </div>
    );
}
