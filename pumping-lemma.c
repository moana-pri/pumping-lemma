 #include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

typedef struct {
    char *x;
    char *y;
    char *z;
    int x_len;
    int y_len;
    int z_len;
} Decomposition;

bool check_anbn(const char *str);
bool check_anbncn(const char *str);
bool check_ww(const char *str);
bool check_astar(const char *str);
bool check_abstar(const char *str);
Decomposition decompose_string(const char *str, int p);
char* pump_string(Decomposition decomp, int i);
void test_pumping_lemma(const char *str, int p, bool (*check_func)(const char*), const char *lang_name);
void free_decomposition(Decomposition decomp);

bool check_anbn(const char *str) {
    int len = strlen(str);
    if (len == 0 || len % 2 != 0) return false;
    
    int half = len / 2;
    for (int i = 0; i < half; i++) {
        if (str[i] != 'a') return false;
    }
    for (int i = half; i < len; i++) {
        if (str[i] != 'b') return false;
    }
    return true;
}

bool check_anbncn(const char *str) {
    int len = strlen(str);
    if (len == 0 || len % 3 != 0) return false;
    
    int third = len / 3;
    for (int i = 0; i < third; i++) {
        if (str[i] != 'a') return false;
    }
    for (int i = third; i < 2 * third; i++) {
        if (str[i] != 'b') return false;
    }
    for (int i = 2 * third; i < len; i++) {
        if (str[i] != 'c') return false;
    }
    return true;
}
bool check_ww(const char *str) {
    int len = strlen(str);
    if (len == 0 || len % 2 != 0) return false;
    
    int half = len / 2;
    return strncmp(str, str + half, half) == 0;
}
bool check_astar(const char *str) {
    for (int i = 0; i < strlen(str); i++) {
        if (str[i] != 'a') return false;
    }
    return true;
}
bool check_abstar(const char *str) {
    for (int i = 0; i < strlen(str); i++) {
        if (str[i] != 'a' && str[i] != 'b') return false;
    }
    return true;
}

Decomposition decompose_string(const char *str, int p) {
    Decomposition decomp;
    int len = strlen(str);
    
    decomp.x_len = (p > 1) ? (p - 1) : 0;
    decomp.y_len = 1;
    decomp.z_len = len - decomp.x_len - decomp.y_len;
    
    if (decomp.x_len > len) decomp.x_len = len > 1 ? len - 1 : 0;
    if (decomp.x_len + decomp.y_len > len) decomp.y_len = len - decomp.x_len;

    decomp.x = (char*)malloc(decomp.x_len + 1);
    decomp.y = (char*)malloc(decomp.y_len + 1);
    decomp.z = (char*)malloc(decomp.z_len + 1);
    
    if (decomp.x_len > 0) {
        strncpy(decomp.x, str, decomp.x_len);
        decomp.x[decomp.x_len] = '\0';
    } else {
        decomp.x[0] = '\0';
    }
    
    strncpy(decomp.y, str + decomp.x_len, decomp.y_len);
    decomp.y[decomp.y_len] = '\0';
    
    if (decomp.z_len > 0) {
        strcpy(decomp.z, str + decomp.x_len + decomp.y_len);
    } else {
        decomp.z[0] = '\0';
    }
    
    return decomp;
}

char* pump_string(Decomposition decomp, int i) {
    int total_len = decomp.x_len + (decomp.y_len * i) + decomp.z_len;
    char *result = (char*)malloc(total_len + 1);
    
    result[0] = '\0';
    
    
    if (decomp.x_len > 0) {
        strcat(result, decomp.x);
    }
    
    for (int j = 0; j < i; j++) {
        strcat(result, decomp.y);
    }
    
    if (decomp.z_len > 0) {
        strcat(result, decomp.z);
    }
    
    return result;
}

void free_decomposition(Decomposition decomp) {
    free(decomp.x);
    free(decomp.y);
    free(decomp.z);
}

void test_pumping_lemma(const char *str, int p, bool (*check_func)(const char*), const char *lang_name) {
    printf("\n========================================\n");
    printf("Testing Pumping Lemma for: %s\n", lang_name);
    printf("========================================\n");
    printf("String s = \"%s\" (length = %ld)\n", str, strlen(str));
    printf("Pumping length p = %d\n\n", p);
    
    if (!check_func(str)) {
        printf("ERROR: String is not in language %s!\n", lang_name);
        return;
    }
    Decomposition decomp = decompose_string(str, p);
    
    printf("Decomposition:\n");
    printf("  x = \"%s\" (length = %d)\n", decomp.x, decomp.x_len);
    printf("  y = \"%s\" (length = %d)\n", decomp.y, decomp.y_len);
    printf("  z = \"%s\" (length = %d)\n", decomp.z, decomp.z_len);
    printf("  |xy| = %d <= p = %d ✓\n", decomp.x_len + decomp.y_len, p);
    printf("  |y| = %d >= 1 ✓\n\n", decomp.y_len);
    
    printf("Pumping test:\n");
    bool failed = false;
    int fail_i = -1;
    
    for (int i = 0; i <= 3; i++) {
        char *pumped = pump_string(decomp, i);
        bool in_lang = check_func(pumped);
        
        printf("  i=%d: xy^%d z = \"%s\" → %s\n", 
               i, i, pumped, in_lang ? "✓ IN L" : "✗ NOT IN L");
        
        if (!in_lang && !failed) {
            failed = true;
            fail_i = i;
        }
        
        free(pumped);
    }
    
    printf("\n");
    if (failed) {
        printf("RESULT: ✗ Pumping lemma FAILS at i=%d\n", fail_i);
        printf("        → Language %s is NOT REGULAR\n", lang_name);
    } else {
        printf("RESULT: ✓ Pumping lemma holds for tested values\n");
        printf("        → Language %s may be REGULAR\n", lang_name);
    }
    
    free_decomposition(decomp);
}

int main() {
    printf("╔═══════════════════════════════════════════════════╗\n");
    printf("║     PUMPING LEMMA DEMONSTRATION IN C             ║\n");
    printf("╚═══════════════════════════════════════════════════╝\n");
    
    printf("\n🔴 Non-Regular Language Test:\n");
    test_pumping_lemma("aaabbb", 3, check_anbn, "{ a^n b^n | n >= 1 }");
    
    test_pumping_lemma("aaabbbccc", 3, check_anbncn, "{ a^n b^n c^n | n >= 1 }");
    
    test_pumping_lemma("abcabc", 3, check_ww, "{ ww | w ∈ {a,b}* }");
    
    printf("\n\n🟢 Regular Language Test:\n");
    test_pumping_lemma("aaaaa", 3, check_astar, "{ a* }");
    
    printf("\n╔═══════════════════════════════════════════════════╗\n");
    printf("║  KEY INSIGHT:                                    ║\n");
    printf("║  - Non-regular languages FAIL the pumping lemma ║\n");
    printf("║  - Regular languages SATISFY the pumping lemma  ║\n");
    printf("╚═══════════════════════════════════════════════════╝\n");
    
    return 0;
}
