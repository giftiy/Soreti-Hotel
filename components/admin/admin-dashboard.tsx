"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Hotel, Calendar, ShoppingCart, DollarSign, TrendingUp, Clock, CreditCard, Plus, Edit, Trash2, Upload, Search, Filter, Send, ChefHat, Beer, Sandwich, Bell, Image as ImageIcon, Eye } from "lucide-react";

type Role = "admin" | "waiter" | "cashier" | "chef" | "barista" | "snacks";
type OrderKind = "food" | "drink" | "snack";
type OrderStatus =
  | "new"
  | "awaiting-cashier-approval"
  | "approved"
  | "routing"
  | "preparing"
  | "ready"
  | "served"
  | "paid"
  | "cancelled";

type Staff = { id: string; name: string; role: Role; phone?: string; status: "active" | "inactive" };

type Room = { id: string; number: string; type: string; price: number; status: "available" | "occupied" | "maintenance"; imageUrl?: string };

type Hall = { id: string; name: string; capacity: number; price: number; status: "available" | "booked" | "maintenance"; imageUrl?: string };

type MenuItem = { id: string; name: string; category: string; price: number; stock?: number; kind: OrderKind; imageUrl?: string; description?: string };

type Booking = { id: string; guest: string; roomNumber: string; status: "reserved" | "checked-in" | "checked-out"; totalAmount: number };

type OrderItem = { itemId: string; name: string; qty: number; price: number; kind: OrderKind };

type Order = {
  id: string;
  table?: string;
  roomNumber?: string;
  placedBy: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
};

type Activity = { id: string; type: string; message: string; at: string };

const uid = () => Math.random().toString(36).slice(2, 10);
const nowISO = () => new Date().toISOString();

const mockStaff: Staff[] = [
  { id: uid(), name: "Amina", role: "waiter", phone: "0911-111111", status: "active" },
  { id: uid(), name: "Beka", role: "cashier", phone: "0911-222222", status: "active" },
  { id: uid(), name: "Sara", role: "chef", phone: "0911-333333", status: "active" },
  { id: uid(), name: "Miki", role: "barista", phone: "0911-444444", status: "active" },
  { id: uid(), name: "Nati", role: "snacks", phone: "0911-555555", status: "inactive" },
];

const mockRooms: Room[] = [
  { id: uid(), number: "101", type: "Single", price: 60, status: "occupied" },
  { id: uid(), number: "102", type: "Double", price: 85, status: "available" },
  { id: uid(), number: "201", type: "Suite", price: 150, status: "maintenance" },
];

const mockHalls: Hall[] = [
  { id: uid(), name: "Conference A", capacity: 120, price: 300, status: "available" },
  { id: uid(), name: "Wedding Hall", capacity: 400, price: 900, status: "booked" },
];

const mockMenu: MenuItem[] = [
  { id: uid(), name: "Shiro", category: "Ethiopian", price: 6, kind: "food", description: "Classic" },
  { id: uid(), name: "Burger", category: "Fast Food", price: 8, kind: "snack", description: "Cheese" },
  { id: uid(), name: "Macchiato", category: "Coffee", price: 2, kind: "drink", description: "Double" },
  { id: uid(), name: "Pizza", category: "Italian", price: 12, kind: "food" },
];

const mockBookings: Booking[] = [
  { id: uid(), guest: "Bob Smith", roomNumber: "102", status: "checked-in", totalAmount: 200 },
  { id: uid(), guest: "Liya Tesfaye", roomNumber: "101", status: "reserved", totalAmount: 120 },
];

const mockOrders: Order[] = [
  {
    id: uid(),
    table: "R-12",
    placedBy: "Amina",
    status: "awaiting-cashier-approval",
    items: [
      { itemId: uid(), name: "Shiro", qty: 2, price: 6, kind: "food" },
      { itemId: uid(), name: "Macchiato", qty: 2, price: 2, kind: "drink" },
    ],
    totalAmount: 16,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },
  {
    id: uid(),
    table: "C-5",
    placedBy: "Amina",
    status: "preparing",
    items: [{ itemId: uid(), name: "Burger", qty: 1, price: 8, kind: "snack" }],
    totalAmount: 8,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },
];

const api = {
  async listAll() {
    return {
      staff: mockStaff,
      rooms: mockRooms,
      halls: mockHalls,
      menu: mockMenu,
      bookings: mockBookings,
      orders: mockOrders,
      revenue: 12000,
      satisfaction: 4.7,
      repeatRate: 0.66,
    };
  },
  async create<T>(key: string, value: T) {
    return value;
  },
  async update<T>(key: string, id: string, patch: Partial<T>) {
    return { id, ...patch } as T;
  },
  async remove(key: string, id: string) {
    return { id };
  },
  async upload(file: File) {
    return URL.createObjectURL(file);
  },
  subscribe(cb: (a: Activity) => void) {
    const i = setInterval(() => {
      cb({ id: uid(), type: "system", message: "Heartbeat", at: new Date().toLocaleString() });
    }, 20000);
    return () => clearInterval(i);
  },
};

function StatCard({ title, value, sub, Icon }: { title: string; value: React.ReactNode; sub?: React.ReactNode; Icon: any }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {sub && <p className="text-xs text-gray-600">{sub}</p>}
          </div>
          <Icon className="h-8 w-8" />
        </div>
      </CardContent>
    </Card>
  );
}

function Chip({ children, tone = "default" }: { children: React.ReactNode; tone?: "success" | "warn" | "muted" | "default" }) {
  const map: Record<string, string> = {
    success: "bg-green-100 text-green-700",
    warn: "bg-orange-100 text-orange-700",
    muted: "bg-gray-100 text-gray-700",
    default: "bg-blue-100 text-blue-700",
  };
  return <span className={`px-2 py-1 text-xs rounded ${map[tone]}`}>{children}</span>;
}

function CrudToolbar({ onAdd, onSearch }: { onAdd?: () => void; onSearch?: (q: string) => void }) {
  const [q, setQ] = useState("");
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input placeholder="Search…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSearch?.(q)} />
      </div>
      {onAdd && (
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Quick Filters</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onSearch?.("")}>Reset</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ConfirmDelete({ onConfirm, trigger = "Delete" }: { onConfirm: () => void; trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="flex items-center gap-2">
          <Trash2 className="h-4 w-4" /> {trigger}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete item?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={onConfirm}>Delete</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MenuManager({ initial }: { initial: MenuItem[] }) {
  const [items, setItems] = useState<MenuItem[]>(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>();

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleSave = async (form: Partial<MenuItem>) => {
    if (file) {
      form.imageUrl = await api.upload(file);
    }
    if (editing) {
      const updated = items.map((it) => (it.id === editing.id ? { ...editing, ...form } as MenuItem : it));
      setItems(updated);
      await api.update<MenuItem>("menu", editing.id, form);
    } else {
      const created: MenuItem = { id: uid(), name: form.name!, category: form.category || "General", price: Number(form.price || 0), stock: Number(form.stock || 0), kind: (form.kind as OrderKind) || "food", imageUrl: form.imageUrl, description: form.description };
      setItems([created, ...items]);
      await api.create<MenuItem>("menu", created);
    }
    setFile(null);
    setPreview(undefined);
    setEditing(null);
    setOpen(false);
  };

  const startEdit = (it: MenuItem) => {
    setEditing(it);
    setPreview(it.imageUrl);
    setOpen(true);
  };

  const remove = async (id: string) => {
    setItems((x) => x.filter((i) => i.id !== id));
    await api.remove("menu", id);
  };

  const filtered = items;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Menu / Inventory</CardTitle>
        <CardDescription>Manage Restaurant, Café & Snacks items (CRUD + Images)</CardDescription>
      </CardHeader>
      <CardContent>
        <CrudToolbar onAdd={() => { setEditing(null); setPreview(undefined); setOpen(true); }} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((it) => (
            <Card key={it.id} className="overflow-hidden">
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                {it.imageUrl ? (
                  <img src={it.imageUrl} alt={it.name} className="h-40 w-full object-cover" />
                ) : (
                  <ImageIcon className="h-10 w-10 text-gray-400" />
                )}
              </div>
              <CardHeader className="pb-0">
                <CardTitle className="text-base">{it.name} <span className="text-gray-500 font-normal">· {it.category}</span></CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Badge variant="secondary">{it.kind}</Badge>
                  <span>${it.price}</span>
                  {typeof it.stock === "number" && <Chip tone={it.stock > 0 ? "success" : "warn"}>{it.stock} in stock</Chip>}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-2">
                <Button size="sm" variant="outline" className="flex items-center gap-2" onClick={() => startEdit(it)}>
                  <Edit className="h-4 w-4" /> Edit
                </Button>
                <ConfirmDelete onConfirm={() => remove(it.id)} />
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[560px]">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Item" : "Add Item"}</DialogTitle>
              <DialogDescription>Upload image, set price & stock, and choose kind (food/drink/snack).</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input defaultValue={editing?.name} id="name" />
                <Label>Category</Label>
                <Input defaultValue={editing?.category} id="category" />
                <Label>Description</Label>
                <Textarea defaultValue={editing?.description} id="description" rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Price</Label>
                <Input defaultValue={editing?.price} id="price" type="number" min={0} />
                <Label>Stock</Label>
                <Input defaultValue={editing?.stock} id="stock" type="number" min={0} />
                <Label>Kind</Label>
                <select id="kind" defaultValue={editing?.kind || "food"} className="w-full border rounded px-3 py-2">
                  <option value="food">food</option>
                  <option value="drink">drink</option>
                  <option value="snack">snack</option>
                </select>
                <Label className="mt-2">Image</Label>
                <div className="flex items-center gap-2">
                  <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  <Upload className="h-5 w-5" />
                </div>
                {preview && (
                  <img src={preview} alt="preview" className="mt-2 h-28 w-full object-cover rounded" />
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                onClick={() =>
                  handleSave({
                    name: (document.getElementById("name") as HTMLInputElement).value,
                    category: (document.getElementById("category") as HTMLInputElement).value,
                    description: (document.getElementById("description") as HTMLTextAreaElement).value,
                    price: Number((document.getElementById("price") as HTMLInputElement).value || 0),
                    stock: Number((document.getElementById("stock") as HTMLInputElement).value || 0),
                    kind: (document.getElementById("kind") as HTMLSelectElement).value as OrderKind,
                  })
                }
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function RoomsManager({ initial }: { initial: Room[] }) {
  const [rows, setRows] = useState<Room[]>(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>();

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const save = async () => {
    const form = {
      number: (document.getElementById("room_number") as HTMLInputElement).value,
      type: (document.getElementById("room_type") as HTMLInputElement).value,
      price: Number((document.getElementById("room_price") as HTMLInputElement).value || 0),
      status: (document.getElementById("room_status") as HTMLSelectElement).value as Room["status"],
    };
    if (file) (form as Partial<Room>).imageUrl = await api.upload(file);
    if (editing) {
      setRows((r) => r.map((x) => (x.id === editing.id ? { ...editing, ...form } : x)));
      await api.update<Room>("rooms", editing.id, form);
    } else {
      const row: Room = { id: uid(), ...form } as Room;
      setRows([row, ...rows]);
      await api.create<Room>("rooms", row);
    }
    setEditing(null);
    setOpen(false);
    setFile(null);
    setPreview(undefined);
  };

  const remove = async (id: string) => {
    setRows((x) => x.filter((r) => r.id !== id));
    await api.remove("rooms", id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rooms</CardTitle>
        <CardDescription>Create, update, delete rooms with images</CardDescription>
      </CardHeader>
      <CardContent>
        <CrudToolbar onAdd={() => { setEditing(null); setOpen(true); }} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>No</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="w-[80px]">
                  {r.imageUrl ? (
                    <img src={r.imageUrl} alt="room" className="h-12 w-16 object-cover rounded" />
                  ) : (
                    <div className="h-12 w-16 bg-gray-100 rounded flex items-center justify-center"><ImageIcon className="h-5 w-5 text-gray-400" /></div>
                  )}
                </TableCell>
                <TableCell>{r.number}</TableCell>
                <TableCell>{r.type}</TableCell>
                <TableCell>${r.price}</TableCell>
                <TableCell>
                  <Badge variant={r.status === "available" ? "secondary" : r.status === "occupied" ? "default" : "outline"}>{r.status}</Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditing(r); setPreview(r.imageUrl); setOpen(true); }} className="mr-2"><Edit className="h-4 w-4" /></Button>
                  <ConfirmDelete onConfirm={() => remove(r.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Room" : "Add Room"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
              <div className="space-y-2">
                <Label>Number</Label>
                <Input id="room_number" defaultValue={editing?.number} />
                <Label>Type</Label>
                <Input id="room_type" defaultValue={editing?.type} />
                <Label>Price</Label>
                <Input id="room_price" type="number" defaultValue={editing?.price} />
                <Label>Status</Label>
                <select id="room_status" defaultValue={editing?.status || "available"} className="w-full border rounded px-3 py-2">
                  <option value="available">available</option>
                  <option value="occupied">occupied</option>
                  <option value="maintenance">maintenance</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Image</Label>
                <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                {preview && (
                  <img src={preview} alt="preview" className="mt-2 h-32 w-full object-cover rounded" />
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function HallsManager({ initial }: { initial: Hall[] }) {
  const [rows, setRows] = useState<Hall[]>(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Hall | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>();

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const save = async () => {
    const form = {
      name: (document.getElementById("hall_name") as HTMLInputElement).value,
      capacity: Number((document.getElementById("hall_capacity") as HTMLInputElement).value || 0),
      price: Number((document.getElementById("hall_price") as HTMLInputElement).value || 0),
      status: (document.getElementById("hall_status") as HTMLSelectElement).value as Hall["status"],
    };
    if (file) (form as Partial<Hall>).imageUrl = await api.upload(file);
    if (editing) {
      setRows((r) => r.map((x) => (x.id === editing.id ? { ...editing, ...form } : x)));
      await api.update<Hall>("halls", editing.id, form);
    } else {
      const row: Hall = { id: uid(), ...form } as Hall;
      setRows([row, ...rows]);
      await api.create<Hall>("halls", row);
    }
    setEditing(null);
    setOpen(false);
    setFile(null);
    setPreview(undefined);
  };

  const remove = async (id: string) => {
    setRows((x) => x.filter((r) => r.id !== id));
    await api.remove("halls", id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Halls</CardTitle>
        <CardDescription>CRUD for event halls with images</CardDescription>
      </CardHeader>
      <CardContent>
        <CrudToolbar onAdd={() => { setEditing(null); setOpen(true); }} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="w-[80px]">
                  {r.imageUrl ? (
                    <img src={r.imageUrl} alt="hall" className="h-12 w-16 object-cover rounded" />
                  ) : (
                    <div className="h-12 w-16 bg-gray-100 rounded flex items-center justify-center"><ImageIcon className="h-5 w-5 text-gray-400" /></div>
                  )}
                </TableCell>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.capacity}</TableCell>
                <TableCell>${r.price}</TableCell>
                <TableCell>
                  <Badge variant={r.status === "available" ? "secondary" : r.status === "booked" ? "default" : "outline"}>{r.status}</Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditing(r); setPreview(r.imageUrl); setOpen(true); }} className="mr-2"><Edit className="h-4 w-4" /></Button>
                  <ConfirmDelete onConfirm={() => remove(r.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Hall" : "Add Hall"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input id="hall_name" defaultValue={editing?.name} />
                <Label>Capacity</Label>
                <Input id="hall_capacity" type="number" defaultValue={editing?.capacity} />
                <Label>Price</Label>
                <Input id="hall_price" type="number" defaultValue={editing?.price} />
                <Label>Status</Label>
                <select id="hall_status" defaultValue={editing?.status || "available"} className="w-full border rounded px-3 py-2">
                  <option value="available">available</option>
                  <option value="booked">booked</option>
                  <option value="maintenance">maintenance</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Image</Label>
                <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                {preview && (
                  <img src={preview} alt="preview" className="mt-2 h-32 w-full object-cover rounded" />
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function StaffManager({ initial }: { initial: Staff[] }) {
  const [rows, setRows] = useState<Staff[]>(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);

  const save = async () => {
    const form = {
      name: (document.getElementById("staff_name") as HTMLInputElement).value,
      role: (document.getElementById("staff_role") as HTMLSelectElement).value as Role,
      phone: (document.getElementById("staff_phone") as HTMLInputElement).value,
      status: (document.getElementById("staff_status") as HTMLSelectElement).value as Staff["status"],
    };
    if (editing) {
      setRows((r) => r.map((x) => (x.id === editing.id ? { ...editing, ...form } : x)));
      await api.update<Staff>("staff", editing.id, form);
    } else {
      const row: Staff = { id: uid(), ...form } as Staff;
      setRows([row, ...rows]);
      await api.create<Staff>("staff", row);
    }
    setEditing(null);
    setOpen(false);
  };
  const remove = async (id: string) => {
    setRows((x) => x.filter((r) => r.id !== id));
    await api.remove("staff", id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff</CardTitle>
        <CardDescription>Manage users and roles (waiter, cashier, chef, barista, snacks)</CardDescription>
      </CardHeader>
      <CardContent>
        <CrudToolbar onAdd={() => { setEditing(null); setOpen(true); }} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{r.role}</Badge>
                </TableCell>
                <TableCell>{r.phone}</TableCell>
                <TableCell>
                  <Badge variant={r.status === "active" ? "default" : "outline"}>{r.status}</Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditing(r); setOpen(true); }} className="mr-2"><Edit className="h-4 w-4" /></Button>
                  <ConfirmDelete onConfirm={() => remove(r.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Staff" : "Add Staff"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input id="staff_name" defaultValue={editing?.name} />
                <Label>Phone</Label>
                <Input id="staff_phone" defaultValue={editing?.phone} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <select id="staff_role" defaultValue={editing?.role || "waiter"} className="w-full border rounded px-3 py-2">
                  <option value="waiter">waiter</option>
                  <option value="cashier">cashier</option>
                  <option value="chef">chef</option>
                  <option value="barista">barista</option>
                  <option value="snacks">snacks</option>
                  <option value="admin">admin</option>
                </select>
                <Label>Status</Label>
                <select id="staff_status" defaultValue={editing?.status || "active"} className="w-full border rounded px-3 py-2">
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

const orderIcon = (k: OrderKind) => (k === "food" ? <ChefHat className="h-4 w-4" /> : k === "drink" ? <Beer className="h-4 w-4" /> : <Sandwich className="h-4 w-4" />);

function OrderBoard({ initial }: { initial: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initial);

  const counts = useMemo(() => {
    const pending = orders.filter((o) => o.status === "awaiting-cashier-approval" || o.status === "preparing").length;
    const ready = orders.filter((o) => o.status === "ready").length;
    const completed = orders.filter((o) => o.status === "served" || o.status === "paid").length;
    return { total: orders.length, pending, ready, completed };
  }, [orders]);

  const setStatus = async (id: string, status: OrderStatus) => {
    setOrders((x) => x.map((o) => (o.id === id ? { ...o, status, updatedAt: nowISO() } : o)));
    await api.update<Order>("orders", id, { status });
  };

  const deleteOrder = async (id: string) => {
    setOrders((x) => x.filter((o) => o.id !== id));
    await api.remove("orders", id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" /> Orders</CardTitle>
        <CardDescription>Cashier approval ➜ Kitchen/Bar/Café ➜ Ready ➜ Served ➜ Paid</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Orders" value={counts.total} Icon={ShoppingCart} />
          <StatCard title="In Progress" value={counts.pending} Icon={Clock} />
          <StatCard title="Ready" value={counts.ready} Icon={Bell} />
          <StatCard title="Completed" value={counts.completed} Icon={DollarSign} />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Placed By</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.id.slice(0, 6)}</TableCell>
                  <TableCell>{o.placedBy}</TableCell>
                  <TableCell>{o.table || (o.roomNumber ? `Room ${o.roomNumber}` : "-")}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {o.items.map((it, i) => (
                        <Badge key={i} variant="secondary" className="flex items-center gap-1">
                          {orderIcon(it.kind)} {it.name}×{it.qty}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge>{o.status}</Badge>
                  </TableCell>
                  <TableCell>${o.totalAmount}</TableCell>
                  <TableCell className="text-right space-x-2 whitespace-nowrap">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">Update Status</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="min-w-[220px]">
                        {(["awaiting-cashier-approval", "approved", "routing", "preparing", "ready", "served", "paid", "cancelled"] as OrderStatus[]).map((s) => (
                          <DropdownMenuItem key={s} onClick={() => setStatus(o.id, s)}>{s}</DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <ConfirmDelete onConfirm={() => deleteOrder(o.id)} trigger={<span>Remove</span>} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function DailyWork({ initial }: { initial: Activity[] }) {
  const [items, setItems] = useState<Activity[]>(initial);
  const [live, setLive] = useState(true);

  useEffect(() => {
    if (!live) return;
    const unsub = api.subscribe((a) => setItems((x) => [{ id: uid(), type: a.type, message: a.message, at: a.at }, ...x]));
    return () => unsub();
  }, [live]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Daily Work</CardTitle>
          <CardDescription>Live stream of system activities</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="live">Realtime</Label>
          <Switch id="live" checked={live} onCheckedChange={setLive} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((a) => (
            <div key={a.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="mt-0.5">
                {a.type === "order" ? <ShoppingCart className="h-4 w-4" /> : a.type === "booking" ? <Calendar className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-900">{a.message}</div>
                <div className="text-xs text-gray-500">{a.at}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loaded, setLoaded] = useState(false);

  const [staff, setStaff] = useState<Staff[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [revenue, setRevenue] = useState(0);
  const [satisfaction, setSatisfaction] = useState(4.7);
  const [repeatRate, setRepeatRate] = useState(0.66);

  useEffect(() => {
    (async () => {
      const d = await api.listAll();
      setStaff(d.staff);
      setRooms(d.rooms);
      setHalls(d.halls);
      setMenu(d.menu);
      setOrders(d.orders);
      setBookings(d.bookings);
      setRevenue(d.revenue);
      setSatisfaction(d.satisfaction);
      setRepeatRate(d.repeatRate);
      setLoaded(true);
    })();
  }, []);

  const stats = useMemo(() => {
    const totalRooms = rooms.length || 1;
    const occupiedRooms = rooms.filter((r) => r.status === "occupied").length;
    const totalBookings = bookings.length;
    const checkedIn = bookings.filter((b) => b.status === "checked-in").length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => ["awaiting-cashier-approval", "preparing"].includes(o.status)).length;
    const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);
    const totalRevenue = revenue + bookings.reduce((s, b) => s + b.totalAmount, 0) + orders.reduce((s, o) => s + o.totalAmount, 0);
    return { totalRooms, occupiedRooms, totalBookings, checkedIn, totalOrders, pendingOrders, occupancyRate, totalRevenue };
  }, [rooms, bookings, orders, revenue]);

  const activities: Activity[] = [
    { id: uid(), type: "booking", message: "New booking for Room 102 by Bob Smith", at: "Today 09:12" },
    { id: uid(), type: "order", message: "Order #X12 awaiting cashier approval", at: "Today 09:05" },
    { id: uid(), type: "staff", message: "Waiter Amina started morning shift", at: "Today 08:50" },
  ];

  if (!loaded) {
    return (
      <div className="p-6 animate-pulse space-y-3">
        <div className="h-6 w-44 bg-gray-200 rounded" />
        <div className="h-4 w-80 bg-gray-100 rounded" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600">Complete hotel management and oversight</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="menu">Restaurant/Café/Snacks</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="halls">Halls</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Staff" value={<>{staff.length} <span className="text-xs text-green-600">{staff.filter((s) => s.status === "active").length} active</span></>} Icon={Users} />
            <StatCard title="Room Occupancy" value={`${stats.occupancyRate}%`} sub={<span>{stats.occupiedRooms}/{stats.totalRooms} rooms</span>} Icon={Hotel} />
            <StatCard title="Active Bookings" value={<>{stats.totalBookings} <span className="text-xs text-blue-600">{stats.checkedIn} checked-in</span></>} Icon={Calendar} />
            <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} sub={<span className="text-green-600">+12% from last month</span>} Icon={DollarSign} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" /> Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Total</span><span className="font-medium">{stats.totalOrders}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Pending</span><span className="font-medium text-orange-600">{stats.pendingOrders}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Completed</span><span className="font-medium text-green-600">{stats.totalOrders - stats.pendingOrders}</span></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Customer Satisfaction</span><span className="font-medium text-green-600">{satisfaction}/5</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Repeat Customers</span><span className="font-medium">{Math.round(repeatRate * 100)}%</span></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activities.map((a) => (
                    <div key={a.id} className="text-sm">
                      <p className="text-gray-900">{a.message}</p>
                      <p className="text-gray-500 text-xs">{a.at}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <DailyWork initial={activities} />
        </TabsContent>

        <TabsContent value="orders">
          <OrderBoard initial={orders} />
        </TabsContent>

        <TabsContent value="menu">
          <MenuManager initial={menu} />
        </TabsContent>

        <TabsContent value="rooms">
          <RoomsManager initial={rooms} />
        </TabsContent>

        <TabsContent value="halls">
          <HallsManager initial={halls} />
        </TabsContent>

        <TabsContent value="staff">
          <StaffManager initial={staff} />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" /> Cashier & Notifications (Preview)</CardTitle>
          <CardDescription>Simulate approvals and waiter notifications (connect to real-time later)</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2"><Eye className="h-4 w-4" /> Open Cashier View (WIP)</Button>
          <Button className="flex items-center gap-2"><Send className="h-4 w-4" /> Send test notification to waiter</Button>
        </CardContent>
      </Card>
    </div>
  );
}
export { AdminDashboard };
