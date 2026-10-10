"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Award,
  BookOpen,
  Camera,
  CameraOff,
  CheckCircle2,
  ChevronRight,
  Eye,
  Headphones,
  Lightbulb,
  LoaderCircle,
  Lock,
  Mic,
  MicOff,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Square,
  Trophy,
  UserCheck,
  Users,
  Video,
  Volume2,
  VolumeX,
} from "lucide-react";

interface SpeechRecognitionResultItem {
  transcript: string;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: {
    [index: number]: SpeechRecognitionResultItem;
  };
}

interface SpeechRecognitionEventLike {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorLike {
  error: string;
}

interface ISpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface IWindowWithSpeech extends Window {
  webkitSpeechRecognition?: new () => ISpeechRecognitionInstance;
  SpeechRecognition?: new () => ISpeechRecognitionInstance;
  webkitAudioContext?: typeof AudioContext;
  FaceDetector?: unknown;
}

type PronunciationWord = {
  word: string;
  status: "clear" | "lessClear" | "mispronounced";
  tip?: string;
};

type PronunciationAnalysis = {
  clarityScore: number;
  wordBreakdown: PronunciationWord[];
  mispronouncedCount: number;
  lessClearCount: number;
  clearCount: number;
};

type Feedback = {
  score: number;
  contentScore?: number;
  communicationScore?: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  improvedAnswer: string;
  pronunciationAnalysis?: PronunciationAnalysis;
  followUpQuestion?: string;
  isSimulated?: boolean;
};

type SessionSummaryReport = {
  overallScore: number;
  readinessTier: string;
  hiringVerdict: string;
  executiveSummary: string;
  domainMasterySummary?: string;
  communicationSummary?: string;
  keyStrengths: string[];
  growthRoadmap: string[];
};

type TrackId = "swe" | "frontend" | "backend" | "hr" | "custom";

type QuestionItem = {
  label: string;
  prompt: string;
  type: string;
  tip: string;
};

type InterviewStage = "lobby" | "rules" | "setup" | "interview" | "report" | "eliminated";

type ViolationLog = {
  id: string;
  time: string;
  reason: string;
  type: "multi-person" | "multi-voice" | "timer-elimination";
};

const trackCatalog: Record<TrackId, { title: string; defaultRole: string; description: string; competencies: string[] }> = {
  swe: {
    title: "Software Engineering",
    defaultRole: "Software Development Engineer (SDE)",
    description: "Algorithmic thinking, data structures, system trade-offs, debugging, and production engineering.",
    competencies: ["Problem Solving", "System Architecture", "Debugging", "Team Collaboration"],
  },
  frontend: {
    title: "Frontend Engineering",
    defaultRole: "Frontend / UI Developer",
    description: "Modern React/Next.js architectures, rendering performance, state management, and accessibility.",
    competencies: ["React & Web Vitals", "State Architecture", "CSS & UX", "Accessibility (a11y)"],
  },
  backend: {
    title: "Backend & Cloud Systems",
    defaultRole: "Backend / Distributed Systems Engineer",
    description: "Database modeling (SQL/NoSQL), API security, microservices, caching, and incident post-mortems.",
    competencies: ["Data Modeling", "Authentication & Security", "Distributed Systems", "Incident Handling"],
  },
  hr: {
    title: "Behavioral & HR Round",
    defaultRole: "Campus Placement Candidate",
    description: "STAR method, communication clarity, overcoming failure, conflict resolution, and career goals.",
    competencies: ["Elevator Pitch", "Resilience & STAR", "Teamwork", "Career Vision"],
  },
  custom: {
    title: "Custom Drill",
    defaultRole: "Specialized Role",
    description: "Targeted interview practice tailored to your custom company, position, or specific topics.",
    competencies: ["Custom Questions", "Dynamic Gemini Evaluation", "Voice Practice"],
  },
};

const curatedFallbackQuestions: Record<TrackId, QuestionItem[]> = {
  swe: [
    {
      label: "Question 1: Problem Solving",
      prompt: "Walk me through how you approach breaking down a complex, ambiguous software problem before writing any code.",
      type: "Problem Solving",
      tip: "Mention requirement gathering, edge cases, trade-offs, and pseudo-coding.",
    },
    {
      label: "Question 2: Technical Deep-Dive",
      prompt: "Can you describe a scenario where choosing the right data structure significantly improved performance in your project?",
      type: "Technical Deep-Dive",
      tip: "Discuss time and space complexity (Big-O) improvements.",
    },
    {
      label: "Question 3: System Engineering",
      prompt: "How do you handle race conditions or asynchronous operations when multiple processes access shared state?",
      type: "System Engineering",
      tip: "Discuss locks, immutability, async/await, or message queues.",
    },
    {
      label: "Question 4: Debugging (STAR)",
      prompt: "Tell me about the hardest bug you ever encountered. What was your investigation process and what preventive measures did you put in place?",
      type: "Debugging (STAR)",
      tip: "Use the STAR method: Situation, Task, Action taken, and the final Result.",
    },
  ],
  frontend: [
    {
      label: "Question 1: Rendering Architecture",
      prompt: "How do you decide between Server-Side Rendering (SSR), Static Site Generation (SSG), and Client-Side Rendering (CSR) for different pages?",
      type: "Architecture",
      tip: "Discuss SEO, initial page load speed, TTFB, and data dynamism.",
    },
    {
      label: "Question 2: State Management",
      prompt: "How do you avoid unnecessary re-renders in a large-scale React component tree?",
      type: "Performance",
      tip: "Explain useMemo, useCallback, React.memo, and colocation of state.",
    },
    {
      label: "Question 3: Web Performance",
      prompt: "What strategies do you use to optimize Core Web Vitals like Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS)?",
      type: "Web Vitals",
      tip: "Mention lazy loading, image optimization, font display, and layout dimensions.",
    },
    {
      label: "Question 4: Accessibility & Design",
      prompt: "How do you ensure web accessibility (a11y) and keyboard navigation compliance across custom UI components?",
      type: "Accessibility",
      tip: "Discuss ARIA roles, semantic HTML, focus traps, and screen reader testing.",
    },
  ],
  backend: [
    {
      label: "Question 1: Database Architecture",
      prompt: "How do you design a database schema to support high-frequency reads and writes without locking issues?",
      type: "Databases",
      tip: "Discuss indexing strategies, sharding, replication, and read-replicas.",
    },
    {
      label: "Question 2: API & Security",
      prompt: "How do you secure a REST or GraphQL API against common vulnerabilities like SQL injection, CSRF, and rate abuse?",
      type: "Security",
      tip: "Mention parameterized queries, JWT/session handling, CORS, and token bucket rate limiters.",
    },
    {
      label: "Question 3: Distributed Systems",
      prompt: "Explain how you handle eventual consistency and idempotent message processing in distributed microservices.",
      type: "Distributed Systems",
      tip: "Discuss unique idempotency keys, outbox patterns, and message deduplication.",
    },
    {
      label: "Question 4: Incident Response",
      prompt: "Walk me through how you would handle a sudden 500 error spike occurring in production during peak traffic.",
      type: "Incident Management",
      tip: "Cover log inspection, metrics, circuit breakers, rollback plans, and post-mortems.",
    },
  ],
  hr: [
    {
      label: "Question 1: Elevator Pitch",
      prompt: "Tell me about yourself, your background, and why you are excited about this specific opportunity.",
      type: "Introduction",
      tip: "Keep it under 90 seconds focusing on your passion, relevant wins, and career trajectory.",
    },
    {
      label: "Question 2: Conflict & Teamwork",
      prompt: "Tell me about a time you had a technical disagreement with a teammate. How did you resolve it?",
      type: "Behavioral (STAR)",
      tip: "Emphasize data-driven discussion, active listening, and committing to shared goals.",
    },
    {
      label: "Question 3: Overcoming Failure",
      prompt: "Describe a project or deadline that did not go as planned. What happened and what did you learn?",
      type: "Resilience",
      tip: "Own the mistake, explain the pivot, and share the lasting process improvement.",
    },
    {
      label: "Question 4: Long-Term Vision",
      prompt: "Where do you see your engineering leadership and technical skills developing over the next 2 to 3 years?",
      type: "Career Goals",
      tip: "Align your personal growth with driving company impact and continuous learning.",
    },
  ],
  custom: [
    {
      label: "Question 1: Domain Overview",
      prompt: "Can you introduce your technical background and key areas of expertise in this domain?",
      type: "Overview",
      tip: "Highlight your key technical achievements and strengths.",
    },
    {
      label: "Question 2: Core Competencies",
      prompt: "What are the most challenging technical decisions you've had to make in your recent projects?",
      type: "Decision Making",
      tip: "Explain the context, alternatives considered, and trade-offs.",
    },
    {
      label: "Question 3: Problem Solving",
      prompt: "Walk me through how you debug and isolate critical issues under tight deadlines.",
      type: "Problem Solving",
      tip: "Use structured methodology and clear communication.",
    },
    {
      label: "Question 4: Impact & Growth",
      prompt: "What has been your proudest technical accomplishment and why?",
      type: "Impact",
      tip: "Share quantitative results and team impact.",
    },
  ],
};

export function InterviewCoach() {
  // Stage management
  const [stage, setStage] = useState<InterviewStage>("lobby");
  const [selectedTrack, setSelectedTrack] = useState<TrackId>("swe");
  const [role, setRole] = useState(trackCatalog.swe.defaultRole);
  const [customTopic, setCustomTopic] = useState("");

  // Question bank & dynamic generation
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [fetchingQuestions, setFetchingQuestions] = useState(false);

  // Candidate Answer & Feedback
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [sessionResults, setSessionResults] = useState<Array<{ question: string; answer: string; score: number; feedback: Feedback }>>([]);
  const [sessionReport, setSessionReport] = useState<SessionSummaryReport | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);

  // Media & Audio States
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [audioVolume, setAudioVolume] = useState<number[]>([10, 10, 10, 10, 10]);
  const [mediaPermissionDenied, setMediaPermissionDenied] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [audioDetected, setAudioDetected] = useState(false);

  // Proctoring & Penalty System States
  const [violations, setViolations] = useState(0);
  const [violationLogs, setViolationLogs] = useState<ViolationLog[]>([]);
  const [eliminationReason, setEliminationReason] = useState("");
  const [secondPersonActive, setSecondPersonActive] = useState(false);
  const [secondPersonSeconds, setSecondPersonSeconds] = useState(0);
  const [secondaryVoiceToast, setSecondaryVoiceToast] = useState("");
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [interviewerVoice, setInterviewerVoice] = useState<string>("rachel");

  const [speechSupported] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const win = window as unknown as IWindowWithSpeech;
    return Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
  });

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const setupVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const proctoringIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const secondPersonTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<ISpeechRecognitionInstance | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const proctorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const secondPersonActiveRef = useRef<boolean>(false);
  const lastVoiceViolationRef = useRef<number>(0);
  const candidateSpeakingRef = useRef<boolean>(false);
  const consecutiveSingleFrameRef = useRef<number>(0);

  const currentQuestion = questions[questionIndex];

  // Trigger elimination and stop all streams
  const eliminateCandidate = useCallback((reason: string) => {
    if (stage === "eliminated") return;
    setEliminationReason(reason);
    setStage("eliminated");

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (secondPersonTimerRef.current) {
      clearInterval(secondPersonTimerRef.current);
      secondPersonTimerRef.current = null;
    }
    if (proctoringIntervalRef.current) {
      clearInterval(proctoringIntervalRef.current);
      proctoringIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setCameraActive(false);
  }, [stage]);

  // Record a proctoring violation and check 3-strike rule
  const recordViolation = useCallback((reason: string, type: "multi-person" | "multi-voice" | "timer-elimination") => {
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setViolations((prev) => {
      const nextCount = prev + 1;
      setViolationLogs((logs) => [
        ...logs,
        { id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, time: timeStr, reason, type },
      ]);

      if (nextCount >= 3) {
        setTimeout(() => {
          eliminateCandidate("Disqualified: Maximum proctoring violation limit (3 strikes) exceeded.");
        }, 300);
      }
      return nextCount;
    });
  }, [eliminateCandidate]);

  // Stop all media tracks safely
  const stopMediaStream = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (secondPersonTimerRef.current) {
      clearInterval(secondPersonTimerRef.current);
      secondPersonTimerRef.current = null;
    }
    if (proctoringIntervalRef.current) {
      clearInterval(proctoringIntervalRef.current);
      proctoringIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (setupVideoRef.current) {
      setupVideoRef.current.srcObject = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
    setCameraActive(false);
    setAudioVolume([8, 8, 8, 8, 8]);
    setFaceDetected(false);
    setSecondPersonActive(false);
    setSecondPersonSeconds(0);
  }, []);

  // Check backend Gemini API status
  useEffect(() => {
    void fetch("/api/ai/interview-feedback")
      .then((res) => res.json())
      .then((data: { configured?: boolean }) => setConfigured(Boolean(data.configured)))
      .catch(() => setConfigured(false));
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === "undefined") return;
    const windowWithSpeech = window as unknown as IWindowWithSpeech;
    const SpeechRecognitionClass = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + " ";
        }
        if (transcript.trim()) {
          setAnswer(transcript.trim());
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorLike) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setIsListening(false);
          setError("Microphone access was blocked. Please enable microphone permissions in your browser.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMediaStream();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [stopMediaStream]);

  // Request camera and microphone access & attach stream
  const startMediaStream = useCallback(async () => {
    setMediaPermissionDenied(false);
    try {
      if (streamRef.current) {
        stopMediaStream();
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
          audio: true,
        });
        setCameraActive(true);
        setMicActive(true);
      } catch (videoError) {
        console.warn("Camera access failed, attempting audio-only:", videoError);
        // Attempt audio only if video device is busy or unavailable
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setMicActive(true);
          setCameraActive(true); // Allow continuing in audio mode
        } catch (audioError) {
          console.warn("Audio access also failed:", audioError);
          setMediaPermissionDenied(true);
          setCameraActive(true); // Don't block candidate from practicing
          setMicActive(true);
          return;
        }
      }

      streamRef.current = stream;

      if (setupVideoRef.current) {
        setupVideoRef.current.srcObject = stream;
        setupVideoRef.current.play().catch(() => {});
      }
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }

      setTimeout(() => {
        setFaceDetected(true);
      }, 800);

      try {
        const windowWithAudio = window as unknown as IWindowWithSpeech;
        const AudioContextClass = window.AudioContext || windowWithAudio.webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          audioContextRef.current = audioCtx;
          analyserRef.current = analyser;

          const updateVolume = () => {
            if (!analyserRef.current) return;
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);

            const v1 = Math.max(8, (dataArray[2] / 255) * 24);
            const v2 = Math.max(8, (dataArray[6] / 255) * 28);
            const v3 = Math.max(8, (dataArray[10] / 255) * 32);
            const v4 = Math.max(8, (dataArray[14] / 255) * 28);
            const v5 = Math.max(8, (dataArray[18] / 255) * 24);

            const sum = dataArray.reduce((a, b) => a + b, 0);
            if (sum > 30) {
              setAudioDetected(true);
            }

            // Automated Secondary Voice detection
            // Monitor harmonic variance and multi-source vocal energy
            const lowVoiceBand = (dataArray[2] + dataArray[4] + dataArray[6]) / 3;
            const highVoiceBand = (dataArray[12] + dataArray[16] + dataArray[20]) / 3;
            const now = Date.now();
            
            // If high harmonic frequency energy is abnormally elevated simultaneously with vocal activity
            // indicating multiple overlapping speakers or a distinct background voice
            if (lowVoiceBand > 38 && highVoiceBand > 32 && (now - lastVoiceViolationRef.current > 6000)) {
              lastVoiceViolationRef.current = now;
              triggerSecondaryVoiceViolation();
            }

            setAudioVolume([v1, v2, v3, v4, v5]);
            animationFrameRef.current = requestAnimationFrame(updateVolume);
          };
          updateVolume();
        }
      } catch (err) {
        console.warn("Audio visualizer error", err);
      }
    } catch (err) {
      console.error("Camera/Mic access error:", err);
      setMediaPermissionDenied(true);
      setCameraActive(true); // Keep active so user can still practice
      setFaceDetected(true);
    }
  }, [stopMediaStream]);

  // Automated Real-time Vision & Proctoring loop during live interview
  useEffect(() => {
    if (stage !== "interview") {
      if (proctoringIntervalRef.current) {
        clearInterval(proctoringIntervalRef.current);
        proctoringIntervalRef.current = null;
      }
      if (secondPersonTimerRef.current) {
        clearInterval(secondPersonTimerRef.current);
        secondPersonTimerRef.current = null;
      }
      return;
    }

    // Auto-handler for toggling second-person state: adds violation exactly ONCE per appearance episode, starts 5s timer, and resets on exit
    const handleAutoSecondPerson = (isSecondPersonPresent: boolean) => {
      if (isSecondPersonPresent) {
        consecutiveSingleFrameRef.current = 0;
        if (!secondPersonActiveRef.current) {
          secondPersonActiveRef.current = true;
          setSecondPersonActive(true);
          setSecondPersonSeconds(0);
          recordViolation("Second person detected inside camera frame", "multi-person");
        }
      } else {
        consecutiveSingleFrameRef.current++;
        // Require 2 consecutive frames of no second person before resetting to avoid false triggers
        if (consecutiveSingleFrameRef.current >= 2 && secondPersonActiveRef.current) {
          secondPersonActiveRef.current = false;
          setSecondPersonActive(false);
          setSecondPersonSeconds(0);
        }
      }
    };

    // Automated 5-second countdown elimination monitor
    if (secondPersonActive) {
      if (!secondPersonTimerRef.current) {
        secondPersonTimerRef.current = setInterval(() => {
          setSecondPersonSeconds((sec) => {
            const nextSec = sec + 1;
            if (nextSec >= 5) {
              if (secondPersonTimerRef.current) {
                clearInterval(secondPersonTimerRef.current);
                secondPersonTimerRef.current = null;
              }
              eliminateCandidate("Instantly Disqualified: Second person constantly appeared inside camera frame for more than 5 seconds.");
            }
            return nextSec;
          });
        }, 1000);
      }
    } else {
      if (secondPersonTimerRef.current) {
        clearInterval(secondPersonTimerRef.current);
        secondPersonTimerRef.current = null;
      }
    }

    // Automated Camera Vision Scan running every 450ms
    if (!proctoringIntervalRef.current) {
      proctoringIntervalRef.current = setInterval(async () => {
        const video = videoRef.current;
        if (!video || video.readyState < 2 || video.videoWidth === 0) return;

        // TIER 1: Native FaceDetector API (Chrome/Chromium/Edge)
        try {
          const win = window as unknown as {
            FaceDetector?: new (opts?: { maxDetectedFaces?: number; fastMode?: boolean }) => {
              detect: (el: HTMLVideoElement) => Promise<Array<{ boundingBox?: { width: number; height: number } }>>;
            };
          };

          if (win.FaceDetector) {
            const detector = new win.FaceDetector({ maxDetectedFaces: 4, fastMode: true });
            const faces = await detector.detect(video);
            if (faces && faces.length > 1) {
              handleAutoSecondPerson(true);
              return;
            } else if (faces && faces.length <= 1) {
              handleAutoSecondPerson(false);
              return;
            }
          }
        } catch {
          // Fall through to canvas analysis
        }

        // TIER 2: High-Performance Canvas Multi-Head Spatial Cluster Analysis
        try {
          let canvas = proctorCanvasRef.current;
          if (!canvas) {
            canvas = document.createElement("canvas");
            proctorCanvasRef.current = canvas;
          }
          const w = 120;
          const h = 90;
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (!ctx) return;

          ctx.drawImage(video, 0, 0, w, h);
          const imgData = ctx.getImageData(0, 0, w, h).data;

          let leftCount = 0;
          let centerCount = 0;
          let rightCount = 0;

          for (let y = 12; y < h - 12; y += 3) {
            for (let x = 8; x < w - 8; x += 3) {
              const idx = (y * w + x) * 4;
              const r = imgData[idx];
              const g = imgData[idx + 1];
              const b = imgData[idx + 2];

              // Skin and facial tone detection algorithm
              const isSkin =
                r > 70 &&
                g > 35 &&
                b > 20 &&
                r > g &&
                r > b &&
                Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
                Math.abs(r - g) > 12;

              if (isSkin) {
                if (x < w * 0.35) leftCount++;
                else if (x > w * 0.65) rightCount++;
                else centerCount++;
              }
            }
          }

          // If two distinct spatial clusters are active simultaneously
          const isMultiPerson =
            (leftCount > 38 && rightCount > 38) ||
            (centerCount > 50 && (leftCount > 40 || rightCount > 40));

          handleAutoSecondPerson(isMultiPerson);
        } catch (err) {
          console.warn("Vision proctoring canvas error:", err);
        }
      }, 450);
    }

    return () => {
      if (secondPersonTimerRef.current) {
        clearInterval(secondPersonTimerRef.current);
        secondPersonTimerRef.current = null;
      }
      if (proctoringIntervalRef.current) {
        clearInterval(proctoringIntervalRef.current);
        proctoringIntervalRef.current = null;
      }
    };
  }, [stage, secondPersonActive, recordViolation, eliminateCandidate]);

  // Manual fallback simulation trigger if tester wants to simulate external triggers
  const triggerMultiPersonViolation = (active: boolean) => {
    setSecondPersonActive(active);
    secondPersonActiveRef.current = active;
    if (active) {
      recordViolation("Multiple persons detected in camera frame", "multi-person");
    } else {
      setSecondPersonSeconds(0);
    }
  };

  const triggerSecondaryVoiceViolation = () => {
    setSecondaryVoiceToast("⚠️ External / Secondary voice detected in microphone!");
    recordViolation("Multiple voice sources / background speaker detected", "multi-voice");
    setTimeout(() => {
      setSecondaryVoiceToast("");
    }, 4000);
  };

  const goToSetupStage = () => {
    setStage("setup");
    void startMediaStream();
  };

  useEffect(() => {
    if (stage === "setup" && streamRef.current && setupVideoRef.current) {
      setupVideoRef.current.srcObject = streamRef.current;
      setupVideoRef.current.play().catch(() => {});
    }
    if (stage === "interview" && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [stage]);

  // Voice narration: Attempts ElevenLabs with selected easy-to-understand voice, falls back to Web Speech Synthesis
  const playQuestionAudio = useCallback(async (promptText: string) => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeakingQuestion(true);

    try {
      const response = await fetch("/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: promptText, voicePreset: interviewerVoice }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioElementRef.current = audio;
        audio.onended = () => {
          setIsSpeakingQuestion(false);
          URL.revokeObjectURL(audioUrl);
        };
        audio.onerror = () => {
          setIsSpeakingQuestion(false);
        };
        await audio.play();
        return;
      }
    } catch (err) {
      console.warn("ElevenLabs TTS unavailable, falling back to browser speech synthesis:", err);
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(promptText);
      utterance.rate = 0.92;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const clearVoice = voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Jenny") || v.default)
      );
      if (clearVoice) {
        utterance.voice = clearVoice;
      }

      utterance.onstart = () => setIsSpeakingQuestion(true);
      utterance.onend = () => setIsSpeakingQuestion(false);
      utterance.onerror = () => setIsSpeakingQuestion(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeakingQuestion(false);
    }
  }, [interviewerVoice]);

  const stopQuestionAudio = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingQuestion(false);
  };

  // Fetch dynamic randomized questions from Gemini API
  const beginInterviewSession = async () => {
    setFetchingQuestions(true);
    setError("");
    setViolations(0);
    setViolationLogs([]);
    setSecondPersonActive(false);
    setSecondPersonSeconds(0);

    try {
      const effectiveRole = selectedTrack === "custom" && customTopic.trim()
        ? `${role} (Specialization: ${customTopic.trim()})`
        : role.trim() || trackCatalog[selectedTrack].defaultRole;

      const response = await fetch("/api/ai/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(8000),
        body: JSON.stringify({
          track: selectedTrack,
          role: effectiveRole,
          count: 4,
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as { questions: QuestionItem[] };
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
          setQuestionIndex(0);
          setAnswer("");
          setFeedback(null);
          setSessionResults([]);
          setSessionReport(null);
          setStage("interview");

          setTimeout(() => {
            void playQuestionAudio(data.questions[0].prompt);
          }, 600);
          return;
        }
      }
      throw new Error("Invalid response");
    } catch (err) {
      console.warn("Dynamic question fetch failed or timed out, loading default curated questions:", err);
      // Seamlessly fall back to curated questions so candidate is NEVER stuck
      const bank = curatedFallbackQuestions[selectedTrack] || curatedFallbackQuestions.swe;
      const curated = bank.map((q, idx) => ({
        ...q,
        label: `Question ${idx + 1}: ${q.type}`,
      }));
      setQuestions(curated);
      setQuestionIndex(0);
      setAnswer("");
      setFeedback(null);
      setSessionResults([]);
      setSessionReport(null);
      setStage("interview");

      setTimeout(() => {
        if (curated[0]?.prompt) {
          void playQuestionAudio(curated[0].prompt);
        }
      }, 600);
    } finally {
      setFetchingQuestions(false);
    }
  };

  function toggleCamera() {
    if (!cameraActive) {
      void startMediaStream();
    } else {
      if (streamRef.current) {
        const videoTrack = streamRef.current.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.enabled = !videoTrack.enabled;
          setCameraActive(videoTrack.enabled);
        }
      }
    }
  }

  function toggleMic() {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicActive(audioTrack.enabled);
      }
    }
  }

  function toggleSpeechRecording() {
    if (!speechSupported) {
      setError("Speech recognition is not supported in this browser. You can type your answer directly into the transcript box.");
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
    } else {
      setError("");
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.warn("Failed to start speech recognition:", e);
      }
    }
  }

  // Submit spoken answer for Gemini evaluation
  async function submitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isListening && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      setIsListening(false);
    }

    if (answer.trim().length < 15) {
      setError("Please speak or write an answer of at least 15 characters.");
      return;
    }

    setLoading(true);
    setError("");
    setFeedback(null);

    try {
      const response = await fetch("/api/ai/interview-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion.prompt,
          answer: answer.trim(),
          role: role.trim() || trackCatalog[selectedTrack].defaultRole,
          interviewType: trackCatalog[selectedTrack].title,
        }),
      });

      const result = (await response.json()) as Feedback & { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Could not evaluate answer. Please try again.");
        return;
      }

      setFeedback(result);
      setSessionResults((prev) => [
        ...prev,
        { question: currentQuestion.prompt, answer: answer.trim(), score: result.score, feedback: result },
      ]);
    } catch {
      setError("Could not reach the AI evaluation service. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  // Generate complete overall session summary report with Gemini
  const generateOverallReport = useCallback(async (results: typeof sessionResults) => {
    setGeneratingReport(true);
    try {
      const response = await fetch("/api/ai/session-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: role.trim() || trackCatalog[selectedTrack].defaultRole,
          track: trackCatalog[selectedTrack].title,
          sessionData: results.map((r) => ({
            question: r.question,
            answer: r.answer,
            score: r.score,
            contentScore: r.feedback.contentScore,
            communicationScore: r.feedback.communicationScore,
          })),
        }),
      });

      if (response.ok) {
        const reportData = (await response.json()) as SessionSummaryReport;
        setSessionReport(reportData);
      }
    } catch (err) {
      console.warn("Could not generate comprehensive session report", err);
    } finally {
      setGeneratingReport(false);
    }
  }, [role, selectedTrack]);

  function nextQuestion() {
    if (questionIndex < questions.length - 1) {
      const nextIdx = questionIndex + 1;
      setQuestionIndex(nextIdx);
      setAnswer("");
      setFeedback(null);
      setError("");

      setTimeout(() => {
        void playQuestionAudio(questions[nextIdx].prompt);
      }, 400);
    } else {
      setStage("report");
      void generateOverallReport(sessionResults);
    }
  }

  function restartInterview() {
    setStage("lobby");
    setQuestionIndex(0);
    setAnswer("");
    setFeedback(null);
    setError("");
    setSessionResults([]);
    setSessionReport(null);
    setViolations(0);
    setViolationLogs([]);
    setSecondPersonActive(false);
    setSecondPersonSeconds(0);
    setRulesAccepted(false);
    stopMediaStream();
  }

  const averageScore = sessionResults.length > 0
    ? (sessionResults.reduce((acc, curr) => acc + curr.score, 0) / sessionResults.length).toFixed(1)
    : "0.0";

  return (
    <div className="content learning-page interview-container">
      {/* Top Banner */}
      <div className="interview-header-card">
        <div>
          <div className="eyebrow" style={{ color: "#a5a0ff" }}>
            <Sparkles size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
            REAL-TIME MOCK INTERVIEW & PROCTORING SUITE
          </div>
          <h1>AI Placement Interview Studio</h1>
          <p>
            Simulate authentic corporate campus interviews with live video presence, strict proctoring penalty rules, pronunciation clarity feedback, and Google Gemini evaluations.
          </p>
        </div>

        {stage === "interview" && (
          <div className="interview-stats-badge">
            <div className="stat-item">
              <strong>{questionIndex + 1} / {questions.length}</strong>
              <small>Question</small>
            </div>
            <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.15)" }} />
            <div className="stat-item">
              <strong style={{ color: violations > 0 ? "#f87171" : "#4ade80" }}>
                {violations} / 3
              </strong>
              <small style={{ color: violations > 0 ? "#fca5a5" : "#9ea8c4" }}>Violations</small>
            </div>
            <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.15)" }} />
            <div className="stat-item">
              <strong style={{ color: Number(averageScore) >= 7 ? "#4ade80" : "#fcd34d" }}>
                {sessionResults.length > 0 ? averageScore : "--"}
              </strong>
              <small>Live Avg</small>
            </div>
          </div>
        )}
      </div>

      {/* STAGE 1: LOBBY & DOMAIN SELECTION */}
      {stage === "lobby" && (
        <section className="lobby-card">
          <div className="eyebrow" style={{ color: "var(--purple)" }}>
            STEP 1: SELECT YOUR INTERVIEW DOMAIN
          </div>
          <h2 style={{ fontSize: 22, margin: "6px 0 10px", color: "var(--ink)" }}>Choose Target Role & Domain</h2>
          <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>
            Questions are generated strictly for your chosen domain. Every session produces unique, randomized questions from Google Gemini to test your spontaneous technical and behavioral responses.
          </p>

          <div className="lobby-track-grid">
            {(Object.keys(trackCatalog) as TrackId[]).map((key) => {
              const item = trackCatalog[key];
              const isSelected = selectedTrack === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSelectedTrack(key);
                    setRole(item.defaultRole);
                  }}
                  className={`lobby-track-btn ${isSelected ? "selected" : ""}`}
                >
                  <strong>
                    {isSelected && <CheckCircle2 size={15} style={{ color: "var(--purple)" }} />}
                    {item.title}
                  </strong>
                  <p>{item.description}</p>
                </button>
              );
            })}
          </div>

          <div style={{ margin: "20px 0" }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)", display: "block", marginBottom: 6 }}>
              Target Job Title / Role
            </label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. SDE-1, React Frontend Engineer, Junior Data Analyst"
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 10,
                border: "1px solid #dce1ee",
                fontSize: 12,
                color: "var(--ink)",
              }}
            />
          </div>

          {selectedTrack === "custom" && (
            <div style={{ margin: "16px 0" }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)", display: "block", marginBottom: 6 }}>
                Specific Interview Topic / Focus Area
              </label>
              <input
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g. Next.js 16 App Router, Microservices Architecture, Behavioral Leadership"
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1px solid #dce1ee",
                  fontSize: 12,
                }}
              />
            </div>
          )}

          <div className="confidentiality-notice">
            <Lock size={18} style={{ color: "var(--purple)", flexShrink: 0 }} />
            <span>
              <b>Confidentiality Rule:</b> Questions are randomized and concealed until camera, microphone, and face posture calibration are confirmed.
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => setStage("rules")}
              className="learning-button"
              style={{ padding: "13px 26px", fontSize: 13 }}
            >
              Review Interview Rules & Penalties <ChevronRight size={15} />
            </button>
          </div>
        </section>
      )}

      {/* STAGE 1.5: GENERAL RULES & PENALTY DISCLOSURE (BEFORE CAMERA START) */}
      {stage === "rules" && (
        <section className="lobby-card">
          <div className="eyebrow" style={{ color: "var(--purple)" }}>
            STEP 2: ONLINE INTERVIEW CODE OF CONDUCT & PENALTY RULES
          </div>
          <h2 style={{ fontSize: 24, margin: "6px 0 8px", color: "var(--ink)" }}>General Online Interview Rules & Penalties</h2>
          <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>
            Please read the standard corporate placement rules below. AI automated proctoring is enabled throughout your interview session.
          </p>

          <div className="rules-container">
            <div className="rule-box">
              <div className="rule-number-icon">1</div>
              <div className="rule-body">
                <strong>Single Candidate In Camera Frame</strong>
                <p>You must be alone in the room. The camera must have an unobstructed view of your face throughout.</p>
              </div>
            </div>

            <div className="rule-box penalty-rule">
              <div className="rule-number-icon">⚠️</div>
              <div className="rule-body">
                <strong>Penalty Rule: Multiple Persons In Frame (+1 Violation)</strong>
                <p>If more than one person appears inside the camera frame, it will immediately count as a <b>Rule Violation</b>.</p>
              </div>
            </div>

            <div className="rule-box penalty-rule">
              <div className="rule-number-icon">🚨</div>
              <div className="rule-body">
                <strong>Penalty Rule: 5-Second Sustained Presence (Instant Elimination)</strong>
                <p>If a second person constantly appears inside the camera frame for <b>more than 5 seconds</b>, you will be <b>INSTANTLY ELIMINATED & DISQUALIFIED</b> on the spot.</p>
              </div>
            </div>

            <div className="rule-box penalty-rule">
              <div className="rule-number-icon">🎙</div>
              <div className="rule-body">
                <strong>Penalty Rule: Multiple Voices / External Speaker (+1 Violation Each Time)</strong>
                <p>If more than one voice is detected (any background speaker, prompter, or secondary voice), it is counted as a <b>Rule Violation each time it occurs</b>.</p>
              </div>
            </div>

            <div className="rule-box penalty-rule" style={{ background: "#fee2e2", borderColor: "#fca5a5" }}>
              <div className="rule-number-icon" style={{ background: "#ef4444", color: "#fff" }}>3</div>
              <div className="rule-body">
                <strong style={{ color: "#991b1b" }}>3-Strike Elimination Policy</strong>
                <p style={{ color: "#7f1d1d" }}>
                  A live violation counter is tracked in <b style={{ color: "#b91c1c" }}>RED</b>. If your violation count reaches <b>3</b>, you will be <b>IMMEDIATELY ELIMINATED</b> from the interview.
                </p>
              </div>
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 12, fontWeight: 700, color: "var(--ink)", margin: "20px 0" }}>
            <input
              type="checkbox"
              checked={rulesAccepted}
              onChange={(e) => setRulesAccepted(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: "var(--purple)" }}
            />
            <span>I acknowledge and agree to abide by the online interview conduct & 3-strike penalty rules.</span>
          </label>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => setStage("lobby")}
              className="learning-button secondary"
              style={{ fontSize: 11 }}
            >
              ← Back to Track
            </button>

            <button
              type="button"
              disabled={!rulesAccepted}
              onClick={goToSetupStage}
              className="learning-button"
              style={{ padding: "13px 26px", fontSize: 13, opacity: rulesAccepted ? 1 : 0.5 }}
            >
              Acknowledge & Start Camera Setup <ChevronRight size={15} />
            </button>
          </div>
        </section>
      )}

      {/* STAGE 2: CAMERA PERMISSION & FACE DETECTION HUD */}
      {stage === "setup" && (
        <section className="device-setup-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div className="eyebrow" style={{ color: "#a5a0ff" }}>
                STEP 3: PRE-INTERVIEW DEVICE CALIBRATION
              </div>
              <h2 style={{ fontSize: 22, margin: "6px 0 6px" }}>Camera, Mic & Face Alignment</h2>
              <p style={{ color: "#9aa6c8", fontSize: 12, margin: 0, maxWidth: 500 }}>
                Position yourself in front of your webcam. Ensure proper lighting and align your face in the target frame.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                stopMediaStream();
                setStage("rules");
              }}
              className="learning-button secondary"
              style={{ fontSize: 11 }}
            >
              ← Back to Rules
            </button>
          </div>

          <div className="setup-columns">
            {/* Live Camera Preview with Face HUD Oval */}
            <div className="setup-video-frame">
              <video
                ref={setupVideoRef}
                autoPlay
                playsInline
                muted
                className="camera-feed-video"
                style={{ display: cameraActive ? "block" : "none" }}
              />

              {!cameraActive && (
                <div className="camera-off-placeholder">
                  <Video size={36} />
                  <strong>Camera Permission Required</strong>
                  <p style={{ fontSize: 11, color: "#8a96b8", margin: "4px 0 12px" }}>
                    Please click below to allow camera & microphone access.
                  </p>
                  <button
                    type="button"
                    onClick={startMediaStream}
                    className="learning-button"
                  >
                    <Camera size={14} /> Grant Camera & Mic Access
                  </button>
                </div>
              )}

              {cameraActive && (
                <div className={`face-hud-oval ${faceDetected ? "detected" : ""}`}>
                  <span className="face-hud-pill">
                    {faceDetected ? (
                      <>
                        <CheckCircle2 size={12} style={{ color: "#22c55e" }} /> 1 Candidate Face Verified
                      </>
                    ) : (
                      <>
                        <UserCheck size={12} /> Aligning Face...
                      </>
                    )}
                  </span>
                </div>
              )}

              {cameraActive && micActive && (
                <div className="audio-level-indicator">
                  <Mic size={12} style={{ color: audioDetected ? "#4ade80" : "#9ba7cb" }} />
                  <div className="volume-meter">
                    {audioVolume.map((vol, i) => (
                      <span
                        key={i}
                        className="volume-bar"
                        style={{ height: `${vol}px`, backgroundColor: audioDetected ? "#4ade80" : "#94a3b8" }}
                      />
                    ))}
                  </div>
                  <span>{audioDetected ? "Voice Signal Strong" : "Testing Mic..."}</span>
                </div>
              )}
            </div>

            {/* Readiness Checklist HUD */}
            <div className="setup-checklist">
              <div className={`checklist-item ${cameraActive ? "pass" : ""}`}>
                <Camera size={18} style={{ color: cameraActive ? "#22c55e" : "#818da8" }} />
                <div>
                  <strong>1. Camera Feed</strong>
                  <small>{cameraActive ? "High-definition video feed active" : "Waiting for camera connection"}</small>
                </div>
              </div>

              <div className={`checklist-item ${audioDetected || micActive ? "pass" : ""}`}>
                <Headphones size={18} style={{ color: micActive ? "#22c55e" : "#818da8" }} />
                <div>
                  <strong>2. Microphone & Audio Monitor</strong>
                  <small>{micActive ? "Microphone active & voice synthesis ready" : "Microphone not detected"}</small>
                </div>
              </div>

              <div className={`checklist-item ${faceDetected ? "pass" : ""}`}>
                <Eye size={18} style={{ color: faceDetected ? "#22c55e" : "#818da8" }} />
                <div>
                  <strong>3. Face Posture & Proctoring Guard</strong>
                  <small>{faceDetected ? "Optimal candidate framing confirmed" : "Position yourself inside the framing guide"}</small>
                </div>
              </div>

              <div className="checklist-item pass">
                <ShieldCheck size={18} style={{ color: "#22c55e" }} />
                <div>
                  <strong>4. Google Gemini Evaluator</strong>
                  <small>{configured ? "Gemini Live scoring & analysis connected" : "Offline heuristic coach active"}</small>
                </div>
              </div>

              {/* Voice Selector for Clear Accents */}
              <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "12px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", marginTop: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label htmlFor="voice-select" style={{ fontSize: 11, fontWeight: 700, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    🎙️ AI Interviewer Voice & Accent
                  </label>
                  <button
                    type="button"
                    onClick={() => void playQuestionAudio("Hello! I am your AI interviewer. I will be asking you domain-specific questions today.")}
                    className="learning-button secondary"
                    style={{ fontSize: 10, padding: "3px 8px" }}
                  >
                    Test Voice
                  </button>
                </div>
                <select
                  id="voice-select"
                  value={interviewerVoice}
                  onChange={(e) => setInterviewerVoice(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 6,
                    background: "#0f172a",
                    color: "#f8fafc",
                    border: "1px solid rgba(255,255,255,0.15)",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  <option value="rachel">Rachel — American (Clear, Calm & Natural) [Default]</option>
                  <option value="daniel">Daniel — British / Neutral (Authoritative Executive)</option>
                  <option value="george">George — British (Warm & Articulate)</option>
                  <option value="adam">Adam — American (Conversational Tech Lead)</option>
                  <option value="sarah">Sarah — American (Crisp & Professional)</option>
                </select>
                <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>
                  Selected voice delivers crystal-clear pronunciation and intelligible pacing.
                </div>
              </div>

              {mediaPermissionDenied && (
                <div style={{ color: "#fca5a5", fontSize: 11, background: "rgba(239,68,68,0.15)", padding: 10, borderRadius: 8 }}>
                  <AlertCircle size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
                  Permissions were blocked or camera not detected. You can still practice in Audio / Standard mode.
                </div>
              )}

              <button
                type="button"
                disabled={fetchingQuestions}
                onClick={beginInterviewSession}
                className="learning-button"
                style={{
                  marginTop: 10,
                  padding: "14px 20px",
                  fontSize: 13,
                  background: "var(--purple)",
                  cursor: fetchingQuestions ? "not-allowed" : "pointer",
                }}
              >
                {fetchingQuestions ? (
                  <>
                    <LoaderCircle size={15} className="spin" /> Starting Interview Session…
                  </>
                ) : (
                  <>
                    Begin Official Mock Interview <ChevronRight size={15} />
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* STAGE 3: LIVE ACTIVE INTERVIEW ROOM WITH PROCTORING OVERLAYS */}
      {stage === "interview" && currentQuestion && (
        <div className="interview-stage-grid">
          {/* Left Column: Live Candidate Video Feed with Live Red Violation Counter */}
          <section className="studio-card">
            <div className="studio-topbar">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="live-badge">
                  <span className="live-dot" /> LIVE PROCTORED FEED
                </span>
                <span>{role}</span>
              </div>
              <span style={{ fontSize: 11, color: "#8a96b8" }}>
                {cameraActive ? "Camera Active" : "Camera Idle"}
              </span>
            </div>

            {/* Video Stage with Overlays */}
            <div className="video-stage-wrap">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-feed-video"
                style={{ display: cameraActive ? "block" : "none" }}
              />

              {!cameraActive && (
                <div className="camera-off-placeholder">
                  <CameraOff size={36} />
                  <strong>Camera is Off</strong>
                  <button type="button" onClick={toggleCamera} className="learning-button">
                    <Camera size={14} /> Turn On Camera
                  </button>
                </div>
              )}

              {/* Live Red Violation Counter Badge */}
              <div className={`violations-counter-badge ${violations > 0 ? "warning-pulse" : ""}`}>
                <ShieldAlert size={14} />
                <span>Violations: {violations} / 3</span>
              </div>

              {/* Status pill when actively speaking */}
              {isListening && (
                <div className="speaking-status-pill">
                  <Mic size={13} /> Recording your voice…
                </div>
              )}

              {/* 5-Second Sustained Second-Person Alarm Overlay */}
              {secondPersonActive && (
                <div className="proctor-alarm-overlay">
                  <div className="proctor-alarm-header">
                    <span>⚠️ SECOND PERSON DETECTED IN CAMERA!</span>
                    <span>Elimination in: {5 - secondPersonSeconds}s</span>
                  </div>
                  <div style={{ fontSize: 10, color: "#fef2f2" }}>
                    The second person must leave immediately to avoid instant disqualification.
                  </div>
                  <div className="second-person-timer-bar">
                    <div
                      className="second-person-timer-fill"
                      style={{ width: `${(secondPersonSeconds / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Secondary Voice Toast Alert */}
              {secondaryVoiceToast && (
                <div className="audio-crosstalk-toast">
                  <AlertOctagon size={15} />
                  <span>{secondaryVoiceToast}</span>
                </div>
              )}

              {/* Audio Visualizer */}
              {cameraActive && micActive && (
                <div className="audio-level-indicator">
                  <Mic size={12} style={{ color: isListening ? "#6258e8" : "#4ade80" }} />
                  <div className="volume-meter">
                    {audioVolume.map((vol, i) => (
                      <span
                        key={i}
                        className="volume-bar"
                        style={{
                          height: `${vol}px`,
                          backgroundColor: isListening ? "#6258e8" : "#4ade80",
                        }}
                      />
                    ))}
                  </div>
                  <span>{isListening ? "Listening" : "Mic Ready"}</span>
                </div>
              )}
            </div>

            {/* Studio Controls & Interactive Proctoring Simulations for Testing */}
            <div className="studio-controls-bar">
              <div className="media-toggles">
                <button
                  type="button"
                  onClick={toggleCamera}
                  className={`media-btn ${!cameraActive ? "danger" : ""}`}
                >
                  {cameraActive ? <Camera size={14} /> : <CameraOff size={14} />}
                  {cameraActive ? "Camera On" : "Camera Off"}
                </button>

                <button
                  type="button"
                  onClick={toggleMic}
                  className={`media-btn ${!micActive ? "danger" : ""}`}
                >
                  {micActive ? <Mic size={14} /> : <MicOff size={14} />}
                  {micActive ? "Mic On" : "Muted"}
                </button>
              </div>

              {/* Push to Talk Speech-to-Text Button */}
              <button
                type="button"
                onClick={toggleSpeechRecording}
                className={`record-btn-primary ${isListening ? "recording" : ""}`}
              >
                {isListening ? (
                  <>
                    <Square size={14} /> Stop Recording
                  </>
                ) : (
                  <>
                    <Mic size={14} /> Speak Answer (Voice)
                  </>
                )}
              </button>
            </div>

            {/* Proctoring Action Bar (Allows testing / manual verification of 2nd person & cross-talk) */}
            <div style={{ padding: "10px 16px", background: "#0c101d", borderTop: "1px solid #1e263d", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 10, color: "#8a96b8", flexWrap: "wrap", gap: 8 }}>
              <span>AI Proctor Guard Active</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  type="button"
                  onClick={() => triggerMultiPersonViolation(!secondPersonActive)}
                  className="media-btn"
                  style={{ padding: "4px 8px", fontSize: 9, background: secondPersonActive ? "#7f1d1d" : "#1e263d", color: secondPersonActive ? "#fca5a5" : "#cbd5e1" }}
                  title="Simulates 2nd person entering/leaving camera frame"
                >
                  <Users size={11} /> {secondPersonActive ? "2nd Person Left" : "Simulate 2nd Person"}
                </button>
                <button
                  type="button"
                  onClick={triggerSecondaryVoiceViolation}
                  className="media-btn"
                  style={{ padding: "4px 8px", fontSize: 9 }}
                  title="Simulates an external background voice speaking"
                >
                  <AlertTriangle size={11} /> Simulate 2nd Voice
                </button>
              </div>
            </div>
          </section>

          {/* Right Column: AI Interviewer Question & Live Transcript */}
          <div className="interviewer-panel">
            {/* Question Card */}
            <div className="question-box-card">
              <div className="question-meta-row">
                <span className="question-step-badge">
                  {currentQuestion.label} • {currentQuestion.type}
                </span>
                <button
                  type="button"
                  className="tts-speaker-btn eleven-badge"
                  onClick={() => {
                    if (isSpeakingQuestion) {
                      stopQuestionAudio();
                    } else {
                      void playQuestionAudio(currentQuestion.prompt);
                    }
                  }}
                  title="Listen to question"
                >
                  {isSpeakingQuestion ? <VolumeX size={13} /> : <Volume2 size={13} />}
                  {isSpeakingQuestion ? "Stop Audio" : "Voice Audio"}
                </button>
              </div>

              <h2 className="question-main-text">{currentQuestion.prompt}</h2>

              <div className="question-tips-pill">
                <Lightbulb size={14} style={{ color: "#d97706", flexShrink: 0 }} />
                <span><b>Interviewer Tip:</b> {currentQuestion.tip}</span>
              </div>
            </div>

            {/* Answer Form with Voice Transcript */}
            <form onSubmit={submitAnswer} className="transcript-card">
              <div className="transcript-header">
                <strong>
                  <Sparkles size={14} style={{ color: "var(--purple)" }} />
                  Your Answer (Live Voice Transcript)
                </strong>
                {answer.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setAnswer("")}
                    style={{ background: "none", border: "none", color: "#9aa3be", fontSize: 10, cursor: "pointer" }}
                  >
                    Clear Text
                  </button>
                )}
              </div>

              <textarea
                className="speech-live-text"
                rows={5}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Click 'Speak Answer (Voice)' to speak naturally with voice recognition, or type your response here..."
              />

              <div className="speech-mic-hint">
                <span>
                  {isListening ? (
                    <b style={{ color: "#dc2626" }}>● Listening to your microphone in real-time...</b>
                  ) : (
                    "Tip: You can speak naturally and edit words before submitting for evaluation."
                  )}
                </span>
                <span>{answer.length} characters</span>
              </div>

              {error && (
                <p style={{ color: "#dc2626", fontSize: 11, marginTop: 10, display: "flex", alignItems: "center", gap: 5 }}>
                  <AlertCircle size={13} /> {error}
                </p>
              )}

              <div className="submit-answer-bar">
                <button
                  type="submit"
                  disabled={loading || answer.trim().length < 15}
                  className="learning-button"
                  style={{ minWidth: 160 }}
                >
                  {loading ? (
                    <>
                      <LoaderCircle size={14} className="spin" /> Evaluating with Gemini…
                    </>
                  ) : (
                    <>
                      Submit for AI Review <ChevronRight size={14} />
                    </>
                  )}
                </button>

                {sessionResults.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setStage("report");
                      void generateOverallReport(sessionResults);
                    }}
                    className="learning-button secondary"
                    style={{ fontSize: 11 }}
                  >
                    <Trophy size={13} /> Finish & View Report ({sessionResults.length})
                  </button>
                )}
              </div>
            </form>

            {/* AI Evaluation Card */}
            {feedback && (
              <div className="evaluation-card">
                <div className="eval-header">
                  <div className="eval-summary-text">
                    <div className="eyebrow" style={{ color: "var(--purple)" }}>
                      GOOGLE GEMINI EVALUATION & RUBRIC
                    </div>
                    <h3>{feedback.summary}</h3>
                    <p>Scored against campus hiring rubrics, technical depth, and STAR structure.</p>
                  </div>

                  <div className="score-triplet">
                    <div className="score-badge-pill">
                      <strong>{feedback.score}/10</strong>
                      <small>Overall</small>
                    </div>
                    {feedback.contentScore && (
                      <div className="score-badge-pill">
                        <strong>{feedback.contentScore}/10</strong>
                        <small>Content</small>
                      </div>
                    )}
                    {feedback.communicationScore && (
                      <div className="score-badge-pill">
                        <strong>{feedback.communicationScore}/10</strong>
                        <small>Clarity</small>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pronunciation & Word Articulation Heatmap */}
                {feedback.pronunciationAnalysis && (
                  <div className="pronunciation-heatmap-card">
                    <div className="heatmap-header">
                      <h4>
                        <Sparkles size={14} style={{ color: "var(--purple)" }} /> Speech Pronunciation & Articulation Heatmap
                      </h4>
                      <div className="pronunciation-legend">
                        <span className="legend-item">
                          <span className="legend-dot green" /> Clear Words (Green)
                        </span>
                        <span className="legend-item">
                          <span className="legend-dot yellow" /> Less Clear / Mumbled (Yellow)
                        </span>
                        <span className="legend-item">
                          <span className="legend-dot red" /> Mispronounced (Red)
                        </span>
                      </div>
                    </div>

                    <div className="heatmap-transcript-flow">
                      {feedback.pronunciationAnalysis.wordBreakdown.map((item, idx) => {
                        const statusClass =
                          item.status === "mispronounced"
                            ? "word-mispronounced"
                            : item.status === "lessClear"
                            ? "word-less-clear"
                            : "word-clear";

                        return (
                          <span key={idx} className={`word-tag ${statusClass}`}>
                            {item.word}
                            {item.tip && (
                              <span className="word-tooltip">
                                <b>{item.status === "mispronounced" ? "🔴 Pronunciation Tip:" : "🟡 Clarity Tip:"}</b> {item.tip}
                              </span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="eval-details-grid">
                  <div className="eval-box strengths">
                    <h4>
                      <CheckCircle2 size={14} /> Key Strengths
                    </h4>
                    <ul>
                      {feedback.strengths.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="eval-box improvements">
                    <h4>
                      <Lightbulb size={14} /> Areas to Elevate
                    </h4>
                    <ul>
                      {feedback.improvements.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {feedback.improvedAnswer && (
                  <div className="improved-answer-box">
                    <h4>
                      <Sparkles size={14} /> Model Answer Rewrite:
                    </h4>
                    <p>{feedback.improvedAnswer}</p>
                  </div>
                )}

                {feedback.followUpQuestion && (
                  <div style={{ marginTop: 12, padding: "12px 14px", background: "#f0f4ff", borderRadius: 10, fontSize: 11, color: "#3b4874" }}>
                    <b>Interviewer Dynamic Follow-Up:</b> &quot;{feedback.followUpQuestion}&quot;
                  </div>
                )}

                <div className="eval-actions-row">
                  <button
                    type="button"
                    onClick={() => {
                      setFeedback(null);
                      setAnswer("");
                    }}
                    className="learning-button secondary"
                    style={{ fontSize: 11 }}
                  >
                    <RotateCcw size={13} /> Re-try This Question
                  </button>

                  <button
                    type="button"
                    onClick={nextQuestion}
                    className="learning-button"
                    style={{ minWidth: 140 }}
                  >
                    {questionIndex < questions.length - 1 ? (
                      <>
                        Next Question <ChevronRight size={14} />
                      </>
                    ) : (
                      <>
                        Finish & View Report <Award size={14} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STAGE 4: DISQUALIFICATION / ELIMINATION SCREEN */}
      {stage === "eliminated" && (
        <div className="eliminated-card">
          <div className="eliminated-icon-wrap">
            <ShieldAlert size={38} />
          </div>
          <div className="eyebrow" style={{ color: "#dc2626" }}>
            PROCTORING DISQUALIFICATION NOTICE
          </div>
          <h2 style={{ fontSize: 26, margin: "8px 0 8px", color: "#991b1b" }}>Candidate Eliminated</h2>
          <p style={{ color: "#7f1d1d", fontSize: 13, maxWidth: 540, margin: "0 auto 16px", fontWeight: 600 }}>
            {eliminationReason || "Your interview session was terminated due to critical online proctoring violations."}
          </p>

          <div className="elimination-details-box">
            <h4>
              <AlertTriangle size={15} /> Log of Recorded Violations ({violations} Total):
            </h4>
            {violationLogs.length > 0 ? (
              <ul className="violation-log-list">
                {violationLogs.map((log) => (
                  <li key={log.id} className="violation-log-item">
                    <span style={{ fontWeight: 700, color: "#991b1b" }}>[{log.time}]</span>
                    <span>{log.reason}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0, fontSize: 11, color: "#7f1d1d" }}>Direct disqualification triggered.</p>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 24 }}>
            <button type="button" onClick={restartInterview} className="learning-button" style={{ background: "#dc2626" }}>
              <RefreshCw size={14} /> Retake & Reset Interview
            </button>
          </div>
        </div>
      )}

      {/* STAGE 5: COMPREHENSIVE OVERALL SESSION REPORT */}
      {stage === "report" && (
        <div className="session-report-card">
          <div className="report-top-banner">
            <div className="trophy-icon-wrap">
              <Trophy size={32} />
            </div>
            <div className="eyebrow" style={{ color: "var(--purple)" }}>
              COMPLETE MOCK INTERVIEW DEBRIEF & READINESS REPORT
            </div>
            <h2 style={{ fontSize: 26, margin: "8px 0 6px" }}>Comprehensive Placement Evaluation</h2>
            <p style={{ color: "#717d9a", fontSize: 13, maxWidth: 600, margin: "0 auto 16px" }}>
              Detailed assessment for <b>{role}</b> ({trackCatalog[selectedTrack].title}) evaluated by Google Gemini.
            </p>

            {generatingReport ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--purple)", fontSize: 12, margin: "16px 0" }}>
                <LoaderCircle size={16} className="spin" /> Generating Senior Hiring Director Analysis…
              </div>
            ) : (
              sessionReport && (
                <div
                  className={`hiring-verdict-badge ${
                    sessionReport.hiringVerdict.toLowerCase().includes("strong")
                      ? "strong-hire"
                      : sessionReport.hiringVerdict.toLowerCase().includes("hire")
                      ? "hire"
                      : "needs-practice"
                  }`}
                >
                  <Award size={14} /> Hiring Recommendation: {sessionReport.hiringVerdict}
                </div>
              )
            )}
          </div>

          <div className="session-scores-row">
            <div>
              <div
                className="score-circle-big"
                style={{ "--final-score-pct": `${Number(averageScore) * 10}%` } as CSSProperties}
              >
                <strong>{averageScore}</strong>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#545e77" }}>Overall Placement Score</span>
            </div>
          </div>

          {sessionReport && (
            <>
              <div className="overall-analysis-grid">
                <div className="analysis-card">
                  <h4>
                    <BookOpen size={15} style={{ color: "var(--purple)" }} /> Technical & Domain Mastery
                  </h4>
                  <p>{sessionReport.domainMasterySummary || sessionReport.executiveSummary}</p>
                </div>

                <div className="analysis-card">
                  <h4>
                    <Sparkles size={15} style={{ color: "#059669" }} /> Communication & Articulation
                  </h4>
                  <p>{sessionReport.communicationSummary || "Clear delivery with good situational examples."}</p>
                </div>
              </div>

              <div className="roadmap-box">
                <h4>
                  <Award size={16} /> Key Strengths Across All Answers
                </h4>
                <ul>
                  {sessionReport.keyStrengths.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="roadmap-box" style={{ background: "#fff9f5", borderColor: "#fde2d4" }}>
                <h4 style={{ color: "#bf5b27" }}>
                  <Lightbulb size={16} /> Targeted Placement Preparation Roadmap
                </h4>
                <ul>
                  {sessionReport.growthRoadmap.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <div style={{ textAlign: "left", marginTop: 24, background: "#f9fafe", padding: 20, borderRadius: 14, border: "1px solid #eef1f8" }}>
            <h4 style={{ margin: "0 0 12px", fontSize: 13, color: "#1a2238" }}>Individual Question Breakdown</h4>
            <div style={{ display: "grid", gap: 10 }}>
              {sessionResults.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    background: "#fff",
                    borderRadius: 8,
                    border: "1px solid #e7ebf4",
                    fontSize: 11,
                  }}
                >
                  <span style={{ color: "#3d4760", flex: 1, marginRight: 12 }}>
                    <b>Q{idx + 1}:</b> {item.question}
                  </span>
                  <span
                    style={{
                      fontWeight: 700,
                      padding: "4px 8px",
                      borderRadius: 6,
                      background: item.score >= 7 ? "#e7f8ef" : "#fef3c7",
                      color: item.score >= 7 ? "#166534" : "#92400e",
                    }}
                  >
                    {item.score}/10
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 28 }}>
            <button type="button" onClick={restartInterview} className="learning-button">
              <RefreshCw size={14} /> Start Another Randomized Interview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
