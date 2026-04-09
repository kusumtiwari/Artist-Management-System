import { UserIcon } from "../../assets";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface TopbarProps {
  username?: string;
  onLogout: () => void;
  role?:string;
}

export default function Topbar({ username = "Admin", onLogout, role }: TopbarProps) {
  return (
    <header
      className="w-full h-14 px-10 xl:px-16 flex items-center justify-between border-b"
      style={{
        background: "var(--bg-background)",
        borderColor: "var(--border-border)",
      }}
    >
      {/* logo */}
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-sm"
          style={{ background: "var(--bg-fill-primary)" }}
        />
        <span
          className="text-sm font-semibold tracking-wide uppercase"
          style={{ color: "var(--text-default)" }}
        >
          AMS
        </span>
      </div>

      {/* right */}
      <div className="flex items-center gap-10">
        <p
          className="text-sm"
          style={{ color: "var(--text-default-secondary)" }}
        >
          Welcome,{" "}
          <span style={{ color: "var(--text-default)", fontWeight: 500 }}>
            {username}
          </span>
        </p>
        <Popover>
          <PopoverTrigger asChild>
            <button>
              <UserIcon className="h-5 w-5 cursor-pointer" />
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            className="w-44 p-3 rounded-md shadow-md border"
            style={{
              background: "var(--bg-background)",
              borderColor: "var(--border-border)",
            }}
          >
            <div className="flex flex-col gap-3">
              {/* Username */}
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-default)" }}
              >
                {username}, {role === 'admin' ? 'Admin' : 'User'}
              </p>

              {/* Divider */}
              <div
                className="h-px"
                style={{ background: "var(--border-border)" }}
              />

              {/* Logout */}
              <Button intent="danger" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
