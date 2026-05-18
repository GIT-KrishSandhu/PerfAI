const Employee = require("../models/Employee");
const axios = require("axios");

// @desc    Get AI recommendations for all employees
// @route   POST /api/ai/recommend
// @access  Private
const getAIRecommendations = async (req, res, next) => {
  try {
    const employees = await Employee.find();

    if (employees.length === 0) {
      res.status(404);
      throw new Error("No employees found in database");
    }

    // Build employee list for prompt
    const employeeList = employees
      .map(
        (e, i) =>
          `${i + 1}. Name: ${e.name} | Department: ${e.department} | Skills: ${e.skills.join(", ")} | Performance Score: ${e.performanceScore}/100 | Experience: ${e.experience} years`
      )
      .join("\n");

    const prompt = `
You are an expert HR analytics AI. Analyze the following employee data and provide detailed recommendations.

Employees:
${employeeList}

For each employee provide:
1. Promotion Recommendation (should they be promoted? why?)
2. Training Suggestions (what skills should they develop?)
3. Performance Feedback (specific feedback based on their score)
4. Overall Ranking (rank them 1 to ${employees.length} based on overall performance)

Scoring Guide:
- 85-100: High performer → Strong promotion candidate
- 70-84: Good performer → Ready for more responsibilities  
- 50-69: Average performer → Needs targeted training
- Below 50: Low performer → Immediate improvement plan needed

Respond ONLY with a valid JSON array, no extra text, no markdown, no backticks.

Response format (strict JSON array):
[
  {
    "name": "Employee Name",
    "department": "Department",
    "performanceScore": 85,
    "rank": 1,
    "promotionRecommendation": "Yes/No/Maybe",
    "promotionReason": "Detailed reason here",
    "trainingSuggestions": ["Skill 1", "Skill 2", "Skill 3"],
    "performanceFeedback": "Detailed feedback here",
    "overallRating": "Excellent/Good/Average/Needs Improvement"
  }
]
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "Employee Performance Analytics",
        },
      }
    );

    const rawText = response.data.choices[0].message.content.trim();

    let aiRecommendations;
    try {
      aiRecommendations = JSON.parse(rawText);
    } catch (parseError) {
      return res.status(500).json({
        message: "AI returned invalid JSON. Try again.",
        raw: rawText,
      });
    }

    // Enrich with MongoDB _id for frontend linking
    const enriched = aiRecommendations.map((aiResult) => {
      const fullEmployee = employees.find(
        (e) => e.name.toLowerCase() === aiResult.name.toLowerCase()
      );
      return {
        ...aiResult,
        _id: fullEmployee?._id || null,
        email: fullEmployee?.email || "N/A",
        skills: fullEmployee?.skills || [],
        experience: fullEmployee?.experience || 0,
      };
    });

    res.json({
      totalEmployees: employees.length,
      generatedAt: new Date().toISOString(),
      recommendations: enriched,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAIRecommendations };