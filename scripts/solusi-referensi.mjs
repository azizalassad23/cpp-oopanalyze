/**
 * Solusi referensi untuk setiap soal di bank soal.
 *
 * PENTING: berkas ini berada di luar folder src/ dan TIDAK pernah ikut
 * dibundel ke halaman web. Kalau diletakkan di frontend, murid bisa
 * membacanya lewat DevTools dan seluruh bank soal jadi tidak ada gunanya.
 *
 * Dipakai hanya oleh scripts/verifikasi-soal.mjs untuk memastikan contoh
 * masukan dan keluaran pada bank soal benar-benar cocok.
 */
export const SOLUSI = {
  'rekursi-mudah': `
#include <iostream>
using namespace std;
int jumlahDigit(long long n) {
    if (n < 10) return (int)n;
    return (int)(n % 10) + jumlahDigit(n / 10);
}
int main() { long long n; cin >> n; cout << jumlahDigit(n) << endl; }
`,

  'rekursi-sedang': `
#include <iostream>
using namespace std;
long long memo[50];
long long cara(int n) {
    if (n <= 2) return n;
    if (memo[n]) return memo[n];
    return memo[n] = cara(n - 1) + cara(n - 2);
}
int main() { int n; cin >> n; cout << cara(n) << endl; }
`,

  'rekursi-sulit': `
#include <iostream>
#include <vector>
using namespace std;
int n, k; vector<int> a; long long total = 0;
void pilih(int i, int sisa) {
    if (i == n) { if (sisa == 0) total++; return; }
    pilih(i + 1, sisa);
    if (sisa >= a[i]) pilih(i + 1, sisa - a[i]);
}
int main() {
    cin >> n >> k; a.resize(n);
    for (auto &x : a) cin >> x;
    pilih(0, k);
    cout << total << endl;
}
`,

  'pencarian-pengurutan-mudah': `
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int n; cin >> n; vector<int> a(n);
    for (auto &x : a) cin >> x;
    sort(a.begin(), a.end());
    for (int i = 0; i < n; i++) { if (i) cout << ' '; cout << a[i]; }
    cout << endl;
}
`,

  'pencarian-pengurutan-sedang': `
#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n; cin >> n; vector<long long> a(n);
    for (auto &x : a) cin >> x;
    long long cari; cin >> cari;
    int kiri = 0, kanan = n - 1, jawab = -1;
    while (kiri <= kanan) {
        int tengah = kiri + (kanan - kiri) / 2;
        if (a[tengah] == cari) { jawab = tengah + 1; break; }
        if (a[tengah] < cari) kiri = tengah + 1; else kanan = tengah - 1;
    }
    cout << jawab << endl;
}
`,

  'pencarian-pengurutan-sulit': `
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;
struct Siswa { string nama; int nilai; };
int main() {
    int n; cin >> n; vector<Siswa> s(n);
    for (auto &x : s) cin >> x.nama >> x.nilai;
    sort(s.begin(), s.end(), [](const Siswa &a, const Siswa &b) {
        if (a.nilai != b.nilai) return a.nilai > b.nilai;
        return a.nama < b.nama;
    });
    for (auto &x : s) cout << x.nama << ' ' << x.nilai << '\\n';
}
`,

  'strategi-pemecahan-mudah': `
#include <iostream>
using namespace std;
int main() {
    long long m; cin >> m;
    int pecahan[] = {50000, 20000, 10000, 5000, 2000, 1000};
    long long lembar = 0;
    for (int p : pecahan) { lembar += m / p; m %= p; }
    cout << lembar << endl;
}
`,

  'strategi-pemecahan-sedang': `
#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n, k; cin >> n >> k; vector<long long> a(n);
    for (auto &x : a) cin >> x;
    long long jendela = 0;
    for (int i = 0; i < k; i++) jendela += a[i];
    long long terbaik = jendela;
    for (int i = k; i < n; i++) {
        jendela += a[i] - a[i - k];
        if (jendela > terbaik) terbaik = jendela;
    }
    cout << terbaik << endl;
}
`,

  'strategi-pemecahan-sulit': `
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int n; long long L; cin >> n >> L;
    vector<long long> b(n);
    for (auto &x : b) cin >> x;
    sort(b.begin(), b.end());
    int i = 0, j = n - 1; long long perahu = 0;
    while (i <= j) {
        if (b[i] + b[j] <= L) i++;
        j--; perahu++;
    }
    cout << perahu << endl;
}
`,

  'struktur-data-mudah': `
#include <iostream>
#include <string>
#include <stack>
using namespace std;
int main() {
    string s; cin >> s;
    stack<char> tumpukan;
    bool seimbang = true;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') tumpukan.push(c);
        else {
            if (tumpukan.empty()) { seimbang = false; break; }
            char atas = tumpukan.top(); tumpukan.pop();
            if ((c == ')' && atas != '(') || (c == ']' && atas != '[') || (c == '}' && atas != '{')) {
                seimbang = false; break;
            }
        }
    }
    if (!tumpukan.empty()) seimbang = false;
    cout << (seimbang ? "SEIMBANG" : "TIDAK") << endl;
}
`,

  'struktur-data-sedang': `
#include <iostream>
#include <string>
#include <map>
using namespace std;
int main() {
    int n; cin >> n;
    map<string, int> hitung;
    for (int i = 0; i < n; i++) { string k; cin >> k; hitung[k]++; }
    string terbaik; int banyak = -1;
    for (auto &p : hitung) if (p.second > banyak) { banyak = p.second; terbaik = p.first; }
    cout << terbaik << ' ' << banyak << endl;
}
`,

  'struktur-data-sulit': `
#include <iostream>
#include <queue>
#include <vector>
using namespace std;
int main() {
    int n; cin >> n;
    priority_queue<long long, vector<long long>, greater<long long>> pq;
    for (int i = 0; i < n; i++) { long long x; cin >> x; pq.push(x); }
    long long total = 0;
    while (pq.size() > 1) {
        long long a = pq.top(); pq.pop();
        long long b = pq.top(); pq.pop();
        total += a + b; pq.push(a + b);
    }
    cout << total << endl;
}
`,

  'graf-tree-mudah': `
#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n, m; cin >> n >> m;
    vector<int> derajat(n + 1, 0);
    for (int i = 0; i < m; i++) { int u, v; cin >> u >> v; derajat[u]++; derajat[v]++; }
    int terbaik = 1;
    for (int i = 2; i <= n; i++) if (derajat[i] > derajat[terbaik]) terbaik = i;
    cout << terbaik << ' ' << derajat[terbaik] << endl;
}
`,

  'graf-tree-sedang': `
#include <iostream>
#include <vector>
#include <queue>
using namespace std;
int main() {
    int n, m; cin >> n >> m;
    vector<vector<int>> sisi(n + 1);
    for (int i = 0; i < m; i++) { int u, v; cin >> u >> v; sisi[u].push_back(v); sisi[v].push_back(u); }
    vector<int> jarak(n + 1, -1);
    queue<int> q; q.push(1); jarak[1] = 0;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : sisi[u]) if (jarak[v] == -1) { jarak[v] = jarak[u] + 1; q.push(v); }
    }
    cout << jarak[n] << endl;
}
`,

  'graf-tree-sulit': `
#include <iostream>
#include <vector>
#include <queue>
using namespace std;
int main() {
    int n; cin >> n;
    vector<vector<int>> anak(n + 1);
    for (int i = 1; i <= n; i++) { int p; cin >> p; if (p != 0) anak[p].push_back(i); }
    int dalam = 0, daun = 0;
    queue<pair<int,int>> q; q.push({1, 1});
    while (!q.empty()) {
        auto [u, t] = q.front(); q.pop();
        if (t > dalam) dalam = t;
        if (anak[u].empty()) daun++;
        for (int v : anak[u]) q.push({v, t + 1});
    }
    cout << dalam << ' ' << daun << endl;
}
`,

  'geometri-dasar-mudah': `
#include <iostream>
#include <iomanip>
#include <cmath>
using namespace std;
int main() {
    double x1, y1, x2, y2; cin >> x1 >> y1 >> x2 >> y2;
    double d = sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    cout << fixed << setprecision(2) << d << endl;
}
`,

  'geometri-dasar-sedang': `
#include <iostream>
#include <iomanip>
#include <cmath>
using namespace std;
int main() {
    double x1, y1, x2, y2, x3, y3;
    cin >> x1 >> y1 >> x2 >> y2 >> x3 >> y3;
    double luas = fabs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0;
    cout << fixed << setprecision(2) << luas << endl;
}
`,

  'geometri-dasar-sulit': `
#include <iostream>
using namespace std;
long long silang(long long ax, long long ay, long long bx, long long by, long long px, long long py) {
    return (bx - ax) * (py - ay) - (by - ay) * (px - ax);
}
int main() {
    long long x1, y1, x2, y2, x3, y3, px, py;
    cin >> x1 >> y1 >> x2 >> y2 >> x3 >> y3 >> px >> py;
    long long d1 = silang(x1, y1, x2, y2, px, py);
    long long d2 = silang(x2, y2, x3, y3, px, py);
    long long d3 = silang(x3, y3, x1, y1, px, py);
    bool adaNegatif = (d1 < 0) || (d2 < 0) || (d3 < 0);
    bool adaPositif = (d1 > 0) || (d2 > 0) || (d3 > 0);
    cout << ((adaNegatif && adaPositif) ? "DI LUAR" : "DI DALAM") << endl;
}
`,
}
