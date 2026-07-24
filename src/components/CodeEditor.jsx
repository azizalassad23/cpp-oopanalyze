import CodeMirror from '@uiw/react-codemirror'
import { cpp } from '@codemirror/lang-cpp'

export default function CodeEditor({ value, onChange }) {
  return (
    <div className="h-full overflow-hidden rounded-xl border border-slate-200 bg-white">
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={[cpp()]}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          bracketMatching: true,
          autocompletion: true,
          tabSize: 4,
        }}
        height="100%"
        className="h-full"
      />
    </div>
  )
}

export const KODE_CONTOH = `#include <iostream>
using namespace std;

// Contoh: menghitung faktorial dengan rekursi
int faktorial(int n) {
    if (n == 0) return 1;
    return n * faktorial(n - 1);
}

int main() {
    int n;
    cin >> n;
    cout << faktorial(n) << endl;
    return 0;
}
`
