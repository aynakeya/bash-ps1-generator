<template>
  <div class="max-w-4xl mx-auto">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h1 class="text-4xl font-bold text-center text-primary mb-8">About Bash PS1 Generator</h1>
        
        <div class="alert alert-info mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>
            This application helps you create custom command line prompts (PS1) for bash 
            with an intuitive drag-and-drop interface. No more struggling with complex 
            escape sequences and color codes!
          </span>
        </div>

        <div class="mb-8">
          <h2 class="text-2xl font-bold text-secondary mb-4 border-b-2 border-primary pb-2">How to Use</h2>
          <ol class="list-decimal list-inside space-y-2">
            <li class="flex items-start gap-2">
              <span class="badge badge-primary badge-sm mt-1">1</span>
              <span><strong class="text-primary">Drag Elements:</strong> From the left panel, drag prompt elements into the builder area</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="badge badge-primary badge-sm mt-1">2</span>
              <span><strong class="text-primary">Customize:</strong> Click on elements to change colors, styles, and custom text</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="badge badge-primary badge-sm mt-1">3</span>
              <span><strong class="text-primary">Preview:</strong> See how your prompt will look in the preview section</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="badge badge-primary badge-sm mt-1">4</span>
              <span><strong class="text-primary">Copy:</strong> Use the copy button to get your generated PS1 string</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="badge badge-primary badge-sm mt-1">5</span>
              <span><strong class="text-primary">Apply:</strong> Add the PS1 to your ~/.bashrc file</span>
            </li>
          </ol>
        </div>

        <div class="mb-8">
          <h2 class="text-2xl font-bold text-secondary mb-4 border-b-2 border-primary pb-2">Features</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="flex items-center gap-2">
              <div class="badge badge-success badge-sm">✓</div>
              <span>Drag and drop interface for easy prompt building</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="badge badge-success badge-sm">✓</div>
              <span>Support for all standard bash prompt elements</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="badge badge-success badge-sm">✓</div>
              <span>Color customization with hex and ANSI colors</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="badge badge-success badge-sm">✓</div>
              <span>Text styling (bold, italic, underline)</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="badge badge-success badge-sm">✓</div>
              <span>Git branch integration</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="badge badge-success badge-sm">✓</div>
              <span>Custom text and symbols</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="badge badge-success badge-sm">✓</div>
              <span>Import/export existing PS1 strings</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="badge badge-success badge-sm">✓</div>
              <span>Live preview of your prompt</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="badge badge-success badge-sm">✓</div>
              <span>Support for Nerd Font glyphs</span>
            </div>
          </div>
        </div>

        <div class="mb-8">
          <h2 class="text-2xl font-bold text-secondary mb-4 border-b-2 border-primary pb-2">Available Elements</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="card bg-base-200 shadow-md">
              <div class="card-body p-4">
                <h3 class="card-title text-lg">📅 Time & Date</h3>
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li>Current date</li>
                  <li>Formatted date</li>
                  <li>Time (24-hour, 12-hour, AM/PM)</li>
                  <li>Time without seconds</li>
                </ul>
              </div>
            </div>

            <div class="card bg-base-200 shadow-md">
              <div class="card-body p-4">
                <h3 class="card-title text-lg">👤 User & System</h3>
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li>Username</li>
                  <li>Hostname (short and full)</li>
                  <li>Working directory</li>
                  <li>Directory basename</li>
                </ul>
              </div>
            </div>

            <div class="card bg-base-200 shadow-md">
              <div class="card-body p-4">
                <h3 class="card-title text-lg">🔧 Command Info</h3>
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li>Command number</li>
                  <li>History number</li>
                  <li>Exit status</li>
                  <li>Prompt sign ($ for user, # for root)</li>
                  <li>Number of background jobs</li>
                </ul>
              </div>
            </div>

            <div class="card bg-base-200 shadow-md">
              <div class="card-body p-4">
                <h3 class="card-title text-lg">🌿 Git Integration</h3>
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li>Current git branch</li>
                  <li>Advanced git status</li>
                </ul>
              </div>
            </div>

            <div class="card bg-base-200 shadow-md">
              <div class="card-body p-4">
                <h3 class="card-title text-lg">🎨 Custom Elements</h3>
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li>Custom text</li>
                  <li>Symbols and special characters</li>
                  <li>Nerd Font glyphs</li>
                  <li>Environment variables</li>
                  <li>Command output</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="alert alert-success mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div>
            <h2 class="text-xl font-bold mb-2">Installing Your PS1</h2>
            <p class="mb-4">To use your generated PS1 prompt:</p>
            <ol class="list-decimal list-inside space-y-2">
              <li>Copy the generated PS1 string from the builder</li>
              <li>Open your <code class="bg-base-300 px-1 rounded">~/.bashrc</code> file in a text editor</li>
              <li>Add this line: <code class="bg-base-300 px-1 rounded">export PS1="[your generated PS1]"</code></li>
              <li>Save the file and run <code class="bg-base-300 px-1 rounded">source ~/.bashrc</code> or restart your terminal</li>
            </ol>
            
            <div class="mt-4">
              <h4 class="font-semibold mb-2">Example:</h4>
              <div class="mockup-code text-xs overflow-x-auto">
                <pre class="whitespace-pre-wrap break-all"><code>export PS1="[\[$(tput sgr0)\]\[$(tput bold)\]\[\033[38;5;213m\]\u\[$(tput sgr0)\] \[$(tput sgr0)\]\[$(tput bold)\]\[\033[38;5;213m\]@\[$(tput sgr0)\] \[$(tput sgr0)\]\[\033[38;5;213m\]\h\[$(tput sgr0)\]]:\[$(tput sgr0)\]\[$(tput bold)\]\[\033[38;5;74m\]\w\[$(tput sgr0)\]\n\[$(tput bold)\]\t\[$(tput sgr0)\] \[$(tput bold)\]\\$\[$(tput sgr0)\] \[$(tput sgr0)\]"</code></pre>
              </div>
            </div>
          </div>
        </div>

        <div class="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>
          <div>
            <h2 class="text-xl font-bold mb-2">Tips</h2>
            <ul class="list-disc list-inside space-y-1">
              <li>Use newlines to create multi-line prompts</li>
              <li>Test your prompt in different directories and git repositories</li>
              <li>Consider readability - too many colors can be distracting</li>
              <li>Backup your original PS1 before making changes</li>
              <li>Use the preview to see how your prompt will look</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
