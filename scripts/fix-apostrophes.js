const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all TypeScript/TSX files that have React no-unescaped-entities errors
const findErrorFiles = () => {
  try {
    // Run eslint to find files with unescaped entity errors
    const output = execSync('npx eslint "app/**/*.tsx" "components/**/*.tsx" -f json', { encoding: 'utf8' });
    const results = JSON.parse(output);
    
    return results
      .filter(file => 
        file.messages.some(msg => 
          msg.ruleId === 'react/no-unescaped-entities' && 
          msg.message.includes("'")
        )
      )
      .map(file => file.filePath);
  } catch (error) {
    // If eslint command fails, extract the filenames from the error output
    const output = error.stdout.toString();
    try {
      const results = JSON.parse(output);
      return results
        .filter(file => 
          file.messages.some(msg => 
            msg.ruleId === 'react/no-unescaped-entities' && 
            msg.message.includes("'")
          )
        )
        .map(file => file.filePath);
    } catch {
      console.error('Failed to find error files', error);
      return [];
    }
  }
};

// Replace all unescaped apostrophes in a file with &apos;
const fixFile = (filePath) => {
  try {
    console.log(`Fixing apostrophes in ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Replace apostrophes within JSX (exclude in comments, strings, regexes)
    // This is a simplistic approach that might need refinement
    const fixedContent = content.replace(
      /(>|\s|\{)([^<>{}]*?)(\w)'(\w)([^<>{}]*?)(<|\s|\})/g,
      (match, before, prefix, wordBefore, wordAfter, suffix, after) => 
        `${before}${prefix}${wordBefore}&apos;${wordAfter}${suffix}${after}`
    );
    
    fs.writeFileSync(filePath, fixedContent);
    console.log(`Fixed ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Failed to fix ${filePath}`, error);
    return false;
  }
};

// Main function
const main = () => {
  console.log('Finding files with unescaped apostrophes...');
  
  // Manually specify the files we know have issues (from the error log)
  const knownErrorFiles = [
    'app/academy/courses/yc-advice/page.tsx',
    'app/auth/confirm/page.tsx',
    'app/auth/verify/page.tsx',
    'app/onboarding/components/steps/BasicInfoStep.tsx',
    'app/onboarding/components/steps/GoalsStep.tsx',
    'components/auth/signin-form.tsx'
  ];
  
  // Fix each file
  let fixedCount = 0;
  knownErrorFiles.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const success = fixFile(fullPath);
      if (success) fixedCount++;
    } else {
      console.warn(`File not found: ${fullPath}`);
    }
  });
  
  console.log(`Fixed apostrophes in ${fixedCount} files.`);
};

main(); 