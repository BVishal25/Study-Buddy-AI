import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

declare global {
  interface Window {
    monaco: any;
    require: any;
  }
}

export default function Sandbox() {
  const [code, setCode] = useState(`# Welcome to the AI Learning Sandbox!
# Try some basic machine learning with scikit-learn

import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt

# Generate sample data
np.random.seed(42)
X = np.random.randn(100, 1)
y = 3 * X.squeeze() + 2 + np.random.randn(100) * 0.5

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

print(f"Model coefficient: {model.coef_[0]:.2f}")
print(f"Model intercept: {model.intercept_:.2f}")
print(f"R² score: {model.score(X_test, y_test):.3f}")

# Plot results
plt.figure(figsize=(10, 6))
plt.scatter(X_test, y_test, alpha=0.7, label='Actual')
plt.scatter(X_test, y_pred, alpha=0.7, label='Predicted')
plt.legend()
plt.title('Linear Regression Results')
plt.xlabel('X')
plt.ylabel('y')
plt.show()
`);

  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [language, setLanguage] = useState("python");
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  useEffect(() => {
    // Load Monaco Editor
    if (window.require) {
      window.require.config({ 
        paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' }
      });
      
      window.require(['vs/editor/editor.main'], () => {
        if (editorRef.current && !monacoRef.current) {
          monacoRef.current = window.monaco.editor.create(editorRef.current, {
            value: code,
            language: language,
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on'
          });

          monacoRef.current.onDidChangeModelContent(() => {
            setCode(monacoRef.current.getValue());
          });
        }
      });
    }

    return () => {
      if (monacoRef.current) {
        monacoRef.current.dispose();
        monacoRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (monacoRef.current) {
      window.monaco.editor.setModelLanguage(monacoRef.current.getModel(), language);
    }
  }, [language]);

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running code...\n");

    // Simulate code execution
    setTimeout(() => {
      if (language === "python") {
        setOutput(`Model coefficient: 2.97
Model intercept: 2.13
R² score: 0.945

[Graph would be displayed here in a real environment]

Execution completed successfully!`);
      } else if (language === "javascript") {
        setOutput(`Console output would appear here.
Code executed successfully!`);
      }
      setIsRunning(false);
    }, 2000);
  };

  const clearOutput = () => {
    setOutput("");
  };

  const loadTemplate = (template: string) => {
    const templates = {
      "linear-regression": `# Linear Regression Example
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Generate sample data
X = np.random.randn(100, 1)
y = 3 * X.squeeze() + 2 + np.random.randn(100) * 0.1

# Create and train model
model = LinearRegression()
model.fit(X, y)

# Make predictions
predictions = model.predict(X)

print(f"Coefficient: {model.coef_[0]:.2f}")
print(f"Intercept: {model.intercept_:.2f}")
print(f"R² Score: {r2_score(y, predictions):.3f}")`,

      "neural-network": `# Simple Neural Network with TensorFlow
import tensorflow as tf
import numpy as np

# Generate sample data
X = np.random.random((1000, 2))
y = (X[:, 0] + X[:, 1] > 1).astype(int)

# Create model
model = tf.keras.Sequential([
    tf.keras.layers.Dense(8, activation='relu', input_shape=(2,)),
    tf.keras.layers.Dense(4, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

# Compile model
model.compile(optimizer='adam',
              loss='binary_crossentropy',
              metrics=['accuracy'])

# Train model
history = model.fit(X, y, epochs=50, batch_size=32, verbose=0)

# Evaluate
loss, accuracy = model.evaluate(X, y, verbose=0)
print(f"Final accuracy: {accuracy:.3f}")`,

      "data-analysis": `# Data Analysis with Pandas
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Create sample dataset
data = {
    'feature1': np.random.randn(100),
    'feature2': np.random.randn(100) * 2,
    'target': np.random.choice([0, 1], 100)
}
df = pd.DataFrame(data)

# Basic statistics
print("Dataset shape:", df.shape)
print("\\nBasic statistics:")
print(df.describe())

print("\\nTarget distribution:")
print(df['target'].value_counts())

print("\\nCorrelation matrix:")
print(df.corr())`,
    };

    const templateCode = templates[template as keyof typeof templates];
    if (templateCode) {
      setCode(templateCode);
      if (monacoRef.current) {
        monacoRef.current.setValue(templateCode);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 ml-64 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              AI Sandbox
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Experiment with AI and machine learning code in a safe environment
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            
            {/* Code Editor */}
            <div className="xl:col-span-3">
              <Card className="h-[700px]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Code Editor</CardTitle>
                    <div className="flex items-center space-x-4">
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="r">R</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        onClick={runCode} 
                        disabled={isRunning}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isRunning ? (
                          <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Running...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-play mr-2"></i>
                            Run Code
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="h-full p-0">
                  <Tabs defaultValue="editor" className="h-full">
                    <TabsList className="w-full justify-start rounded-none border-b">
                      <TabsTrigger value="editor">Editor</TabsTrigger>
                      <TabsTrigger value="output">Output</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="editor" className="h-full mt-0">
                      <div 
                        ref={editorRef} 
                        className="h-[calc(100%-60px)] w-full"
                      />
                    </TabsContent>
                    
                    <TabsContent value="output" className="h-full mt-0">
                      <div className="h-[calc(100%-60px)] p-4 bg-gray-900 text-green-400 font-mono text-sm overflow-auto">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-gray-400">Output Console</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={clearOutput}
                            className="text-gray-400 hover:text-white"
                          >
                            <i className="fas fa-trash mr-2"></i>
                            Clear
                          </Button>
                        </div>
                        <pre className="whitespace-pre-wrap">
                          {output || "No output yet. Run your code to see results here."}
                        </pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Code Templates */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Code Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left"
                      onClick={() => loadTemplate('linear-regression')}
                    >
                      <i className="fas fa-chart-line mr-2"></i>
                      Linear Regression
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left"
                      onClick={() => loadTemplate('neural-network')}
                    >
                      <i className="fas fa-brain mr-2"></i>
                      Neural Network
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left"
                      onClick={() => loadTemplate('data-analysis')}
                    >
                      <i className="fas fa-chart-bar mr-2"></i>
                      Data Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Environment Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Environment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Language</span>
                      <Badge>{language}</Badge>
                    </div>
                    <Separator />
                    <div className="text-sm">
                      <h4 className="font-medium mb-2">Available Libraries:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• NumPy</li>
                        <li>• Pandas</li>
                        <li>• Scikit-learn</li>
                        <li>• TensorFlow</li>
                        <li>• Matplotlib</li>
                        <li>• Seaborn</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-medium">Keyboard Shortcuts:</h4>
                      <ul className="text-muted-foreground space-y-1 mt-1">
                        <li>Ctrl+Enter: Run code</li>
                        <li>Ctrl+S: Save</li>
                        <li>Ctrl+Z: Undo</li>
                        <li>Ctrl+/: Comment</li>
                      </ul>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-medium">Pro Tips:</h4>
                      <ul className="text-muted-foreground space-y-1 mt-1">
                        <li>• Use print() to debug</li>
                        <li>• Start with templates</li>
                        <li>• Test with small datasets</li>
                        <li>• Check data shapes</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Save & Share */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full" variant="outline">
                      <i className="fas fa-save mr-2"></i>
                      Save Code
                    </Button>
                    <Button className="w-full" variant="outline">
                      <i className="fas fa-share mr-2"></i>
                      Share
                    </Button>
                    <Button className="w-full" variant="outline">
                      <i className="fas fa-download mr-2"></i>
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">Interactive Sandbox</h2>
          <p className="text-sm mb-2">Open the embedded sandbox to run code quickly (CodeSandbox new project).</p>
          <iframe title="codesandbox" src="https://codesandbox.io/s/new" style={{width:'100%',height:600,border:'1px solid #e5e7eb',borderRadius:8}}></iframe>
        </div>
        </main>
      </div>
    </div>
  );
}
