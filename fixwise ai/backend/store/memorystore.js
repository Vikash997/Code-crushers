let memory = [];

export function searchMemory(query) {
  if (!query) return [];
  
  const lowerQuery = query.toLowerCase();
  return memory
    .filter(m => 
      m.issue.toLowerCase().includes(lowerQuery) || 
      m.fix.toLowerCase().includes(lowerQuery)
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5)
    .map(m => ({
      issue: m.issue,
      fix: m.fix,
      success: m.success
    }));
}

export function storeMemory(data) {
  const newMem = {
    id: Date.now().toString(),
    ...data,
    timestamp: new Date().toISOString()
  };
  memory.push(newMem);
  return newMem.id;
}

export function updateLastMemory(id, helpful) {
  const mem = memory.find(m => m.id === id);
  if (mem) {
    mem.success = helpful;
  }
}

// Debug
export function getAllMemory() {
  return memory;
}
