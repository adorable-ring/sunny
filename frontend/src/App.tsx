import { useEffect, useMemo, useState } from 'react';
import { Category, Item, Review, User } from './types';
import { createItem, createReview, createUser, getItemReviews, listItems } from './api';

const categories: Category[] = ['TECH','FASHION','BEAUTY','FOOD','ENTERTAINMENT','SPORTS','OTHER'];

function Section(props: { title: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <h2>{props.title}</h2>
      {props.children}
    </div>
  );
}

function CategoryFilter({ value, onChange }: { value?: Category; onChange: (c?: Category)=>void }) {
  return (
    <div className="actions">
      <select value={value ?? ''} onChange={(e)=> onChange(e.target.value ? e.target.value as Category : undefined)}>
        <option value="">All Categories</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <button onClick={()=> onChange(undefined)}>Clear</button>
    </div>
  );
}

function UserForm({ onCreated }: { onCreated: (u: User)=>void }) {
  const [username,setUsername] = useState('');
  const [email,setEmail] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await createUser({ username, email });
    onCreated(user);
    setUsername(''); setEmail('');
  };
  return (
    <form onSubmit={submit} className="card">
      <h3>Create User</h3>
      <label>Username</label>
      <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="coolkid123" required />
      <label style={{marginTop:8}}>Email</label>
      <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" required />
      <div className="actions" style={{marginTop:10}}><button className="primary" type="submit">Create</button></div>
    </form>
  );
}

function ItemForm({ onCreated }: { onCreated: (i: Item)=>void }) {
  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  const [category,setCategory] = useState<Category>('TECH');
  const [mediaUrls,setMediaUrls] = useState<string[]>(['','','']);
  const [mediaTypes,setMediaTypes] = useState<Array<'IMAGE'|'VIDEO'>>(['IMAGE','IMAGE','IMAGE']);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mediaAssets = mediaUrls
      .map((url, idx) => url.trim() ? { url: url.trim(), type: mediaTypes[idx] } : null)
      .filter(Boolean)
      .slice(0,3) as Item['mediaAssets'];
    const item = await createItem({ title, description, category, mediaAssets });
    onCreated(item);
    setTitle(''); setDescription(''); setMediaUrls(['','','']);
  };

  return (
    <form onSubmit={submit} className="card">
      <h3>Create Item</h3>
      <div className="row">
        <div>
          <label>Title</label>
          <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Product name" required />
        </div>
        <div>
          <label>Category</label>
          <select value={category} onChange={(e)=>setCategory(e.target.value as Category)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <label style={{marginTop:8}}>Description</label>
      <textarea rows={3} value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="What is this item about?" />
      <div className="hr" />
      <h4>Media (up to 3)</h4>
      <div className="row">
        {[0,1,2].map(i => (
          <div key={i}>
            <label>URL #{i+1}</label>
            <input value={mediaUrls[i]} onChange={(e)=> {
              const next = [...mediaUrls]; next[i] = e.target.value; setMediaUrls(next);
            }} placeholder="https://..." />
            <label style={{marginTop:6}}>Type</label>
            <select value={mediaTypes[i]} onChange={(e)=> {
              const next = [...mediaTypes] as Array<'IMAGE'|'VIDEO'>; next[i] = e.target.value as any; setMediaTypes(next);
            }}>
              <option>IMAGE</option>
              <option>VIDEO</option>
            </select>
          </div>
        ))}
      </div>
      <div className="actions" style={{marginTop:10}}><button className="primary" type="submit">Create</button></div>
    </form>
  );
}

function ReviewForm({ users, items, onCreated }: {
  users: User[]; items: Item[]; onCreated: (r: Review)=>void
}) {
  const [userId,setUserId] = useState<number>();
  const [itemId,setItemId] = useState<number>();
  const [rating,setRating] = useState<number>(4);
  const [description,setDescription] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !itemId) return;
    const review = await createReview({ userId, itemId, rating, description });
    onCreated(review);
    setRating(4); setDescription('');
  };

  return (
    <form onSubmit={submit} className="card">
      <h3>Create Review</h3>
      <div className="row">
        <div>
          <label>User</label>
          <select value={userId ?? ''} onChange={(e)=> setUserId(Number(e.target.value)||undefined)} required>
            <option value="">Select user</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
          </select>
        </div>
        <div>
          <label>Item</label>
          <select value={itemId ?? ''} onChange={(e)=> setItemId(Number(e.target.value)||undefined)} required>
            <option value="">Select item</option>
            {items.map(i => <option key={i.id} value={i.id}>{i.title}</option>)}
          </select>
        </div>
      </div>
      <div className="row" style={{marginTop:8}}>
        <div>
          <label>Rating (1.0 - 5.0)</label>
          <input type="number" step="0.1" min="1" max="5" value={rating} onChange={(e)=> setRating(Number(e.target.value))} />
        </div>
        <div>
          <label>Description</label>
          <input value={description} onChange={(e)=> setDescription(e.target.value)} placeholder="Your thoughts..." />
        </div>
      </div>
      <div className="actions" style={{marginTop:10}}><button className="primary" type="submit">Create</button></div>
    </form>
  );
}

function ItemCard({ item, onOpen }: { item: Item; onOpen: ()=>void }) {
  return (
    <div className="card item-card">
      <div className="badge">{item.category}</div>
      <h3>{item.title}</h3>
      <p style={{color:'#cbd5e1'}}>{item.description}</p>
      {item.mediaAssets?.length ? (
        <div className="media">
          {item.mediaAssets.map((m, idx) =>
            m.type === 'IMAGE'
              ? <img key={idx} src={m.url} alt={`media-${idx}`} />
              : <video key={idx} src={m.url} controls />
          )}
        </div>
      ) : null}
      <div className="actions" style={{marginTop:10}}>
        <button onClick={onOpen}>View Reviews</button>
      </div>
    </div>
  );
}

export default function App() {
  const [users,setUsers] = useState<User[]>([]);
  const [items,setItems] = useState<Item[]>([]);
  const [selectedCategory,setSelectedCategory] = useState<Category>();
  const [selectedItemId,setSelectedItemId] = useState<number>();
  const [selectedItemReviews,setSelectedItemReviews] = useState<Review[]>([]);

  const itemsToShow = useMemo(
    () => items.filter(i => !selectedCategory || i.category === selectedCategory),
    [items, selectedCategory]
  );

  useEffect(()=> {
    listItems().then(setItems).catch(()=>{});
  }, []);

  useEffect(()=> {
    if (selectedItemId) {
      getItemReviews(selectedItemId).then(setSelectedItemReviews).catch(()=> setSelectedItemReviews([]));
    }
  }, [selectedItemId]);

  return (
    <div className="container">
      <h1>Gen Z Reviews</h1>
      <p style={{color:'#9ca3af'}}>Create users, items, and reviews. Browse items by category.</p>

      <div className="row" style={{marginTop:12}}>
        <UserForm onCreated={(u)=> setUsers(prev=> [...prev, u])} />
        <ItemForm onCreated={(i)=> setItems(prev=> [i, ...prev])} />
      </div>

      <div className="hr" />

      <Section title="Dashboard">
        <div className="actions">
          <CategoryFilter value={selectedCategory} onChange={setSelectedCategory} />
        </div>
        <div className="list" style={{marginTop:12}}>
          {itemsToShow.map(it => (
            <ItemCard key={it.id} item={it} onOpen={()=> setSelectedItemId(it.id!)} />
          ))}
        </div>
      </Section>

      <div className="hr" />

      <div className="row">
        <ReviewForm
          users={users}
          items={items}
          onCreated={(r)=> {
            if (r.itemId === selectedItemId) setSelectedItemReviews(prev => [r, ...prev]);
          }}
        />
        <div className="card">
          <h3>Item Reviews</h3>
          {selectedItemId ? (
            selectedItemReviews.length ? selectedItemReviews.map(r => (
              <div key={r.id} className="card" style={{padding:12, marginBottom:8}}>
                <div className="badge">Rating: {r.rating.toFixed(1)}</div>
                <p style={{margin:'8px 0 0'}}>{r.description}</p>
              </div>
            )) : <p style={{color:'#9ca3af'}}>No reviews yet.</p>
          ) : <p style={{color:'#9ca3af'}}>Select an item to view reviews.</p>}
        </div>
      </div>
    </div>
  );
}