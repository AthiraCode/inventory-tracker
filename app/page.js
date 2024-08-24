'use client'
import { useState, useEffect } from "react";
import { firestore } from '@/firebase';
import { Box, Modal, Typography, Stack, TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { 
  collection, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  getDoc, 
  setDoc 
} from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [existingItem, setExistingItem] = useState(null);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });

    // Sort alphabetically
    inventoryList.sort((a, b) => a.name.localeCompare(b.name));
    
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  const addItem = async (item) => {
    const existingItem = inventory.find(invItem => invItem.name.toLowerCase() === item.toLowerCase());

    if (existingItem) {
      setExistingItem(existingItem);
      setConfirmOpen(true);
    } else {
      const docRef = doc(collection(firestore, 'inventory'), item);
      await setDoc(docRef, { quantity: 1 });
      await updateInventory();
    }
  };

  const confirmAddItem = async () => {
    const docRef = doc(collection(firestore, 'inventory'), existingItem.name);
    const { quantity } = existingItem;
    await setDoc(docRef, { quantity: quantity + 1 });
    setConfirmOpen(false);
    setExistingItem(null);
    setItemName('');
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = inventory.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredInventory(filtered);
    } else {
      setFilteredInventory(inventory);
    }
  }, [searchQuery, inventory]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirmClose = () => setConfirmOpen(false);

  const handleReset = () => {
    setSearchQuery('');
    setFilteredInventory(inventory);
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={4}
      sx={{ 
        backgroundColor: '#e0f7fa', 
        padding: 3, 
        overflow: 'auto',
      }}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          borderRadius={2}
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%,-50%)',
            border: '1px solid #ddd',
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button 
              variant="contained" 
              onClick={() => {
                addItem(itemName);
                handleClose();
              }}
              sx={{ backgroundColor: '#00796b', color: '#fff' }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
      >
        <DialogTitle>Item Already Exists</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The item "{existingItem?.name}" already exists in the inventory. Do you want to increase its quantity?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmAddItem} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h3" component="h1" sx={{ mb: 2, color: '#004d40' }}>
        Pantry Tracker
      </Typography>

      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{ mb: 2, backgroundColor: '#004d40', color: '#fff' }}
      >
        Add New Item
      </Button>

      <Stack direction="row" spacing={2} mb={4}>
        <TextField
          variant='outlined'
          placeholder='Search items...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: '300px' }}
        />
        <Button
          variant="outlined"
          onClick={handleReset}
          sx={{ backgroundColor: '#00796b', color: '#fff' }}
        >
          Reset
        </Button>
      </Stack>

      <Box 
        width="80%" 
        maxWidth="1000px" 
        bgcolor="white" 
        borderRadius={2} 
        boxShadow={3} 
        overflow="auto"
        sx={{ maxHeight: '60vh' }}
      >
        <Box 
          width="100%" 
          height="100px" 
          bgcolor="#00796b" 
          display="flex" 
          alignItems="center" 
          justifyContent='center'
          borderRadius="2px 2px 0 0"
        >
          <Typography variant='h2' color ='#fff'>
            Inventory Items
          </Typography>
        </Box>

        <Stack width="100%" spacing={2} p={2} overflow="auto">
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgColor="#fafafa"
              padding={2}
              borderRadius={1}
              boxShadow={1}
              sx={{ 
                border: '1px solid #ddd', 
                backgroundColor: '#f1f8e9',
              }}
            >
              <Typography variant="h4" color="#004d40" flex={1}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h4" color="#004d40" flex={1} textAlign="center">
                {quantity}
              </Typography> 
              <Stack direction="row" spacing={1}>
                <Button 
                  variant="contained" 
                  onClick={() => addItem(name)}
                  sx={{ backgroundColor: '#00796b', color: '#fff' }}
                >
                  Add
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => removeItem(name)}
                  sx={{ backgroundColor: '#d32f2f', color: '#fff' }}
                >
                  Remove
                </Button>
              </Stack>           
            </Box>
          ))}
        </Stack>
      </Box>
    </Box> 
  );
}
