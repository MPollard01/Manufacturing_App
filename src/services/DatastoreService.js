import { firebaseFireStore } from "@/firebase/database";

function addData(formData, collection, id) {
    firebaseFireStore.collection(collection).doc(id).set(formData);
}

function updateData(collection, id, data) {
    firebaseFireStore.collection(collection).doc(id).update(data)
}

function addBatch(jobId, batchId, formData) {
    firebaseFireStore.collection("jobs").doc(jobId).collection("batches").doc(batchId).set(formData);
}

async function fetchData(collection) {
    const snapshot  = await firebaseFireStore.collection(collection).get();
    const data = snapshot.docs.map((doc) => doc.data());
    return data;
}

async function fetchAllBatches() {
    const snapshot  = await firebaseFireStore.collectionGroup("batches").get();
    const data = snapshot.docs.map((doc) => doc.data());
    return data;
}

async function fetchBatch(id) {
    const snapshot  = await firebaseFireStore.collection("jobs").doc(id).collection("batches").get();
    const data = snapshot.docs.map((doc) => doc.data());
    return data;
}

function updateBatch(jobId, batchId, obj) {
    firebaseFireStore.collection("jobs").doc(jobId).collection("batches").doc(batchId).update(obj);
}

export default {
    addData,
    fetchData,
    addBatch,
    fetchBatch,
    updateBatch,
    updateData,
    fetchAllBatches
};