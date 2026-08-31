type LiveEvent = {
  type: "STATUS_CHANGE" | "NEW_BOOKING" | "MECHANIC_MOVE" | "METRICS_UPDATE";
  data: any;
  timestamp: string;
};

type Listener = (event: LiveEvent) => void;

class RealtimeHub {
  private listeners: Set<Listener> = new Set();

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public broadcast(type: LiveEvent["type"], data: any) {
    const event: LiveEvent = {
      type,
      data,
      timestamp: new Date().toISOString(),
    };
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error("Error broadcasting to SSE listener:", err);
      }
    });
  }

  public getSubscriberCount() {
    return this.listeners.size;
  }
}

declare global {
  var realtimeHub: RealtimeHub | undefined;
}

export const realtimeHub = global.realtimeHub || new RealtimeHub();
if (process.env.NODE_ENV !== "production") {
  global.realtimeHub = realtimeHub;
}
